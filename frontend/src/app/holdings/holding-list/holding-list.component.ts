import { Component, Input, OnInit, OnChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { MenuModule } from 'primeng/menu';
import { MenuItem } from 'primeng/api';
import { Holding } from '../../shared/models/portfolio.model';
import { HoldingService } from '../holding.service';

@Component({
  selector: 'app-holding-list',
  imports: [CommonModule, TableModule, ButtonModule, MenuModule],
  templateUrl: './holding-list.component.html',
  styleUrl: './holding-list.component.css'
})
export class HoldingListComponent implements OnInit, OnChanges {
  @Input() portfolioId!: string;
  
  holdings: Holding[] = [];
  menuItems: MenuItem[] = [];

  constructor(private holdingService: HoldingService) {}

  ngOnInit(): void {
    this.loadHoldings();
    this.setupMenuItems();
  }

  setupMenuItems(): void {
    this.menuItems = [
      {
        label: 'Edit',
        icon: 'pi pi-pencil',
        command: () => this.editHolding(this.selectedHolding)
      },
      {
        label: 'Delete',
        icon: 'pi pi-trash',
        command: () => this.deleteHolding(this.selectedHolding)
      }
    ];
  }

  selectedHolding!: Holding;

  ngOnChanges(): void {
    if (this.portfolioId) {
      this.loadHoldings();
    }
  }

  loadHoldings(): void {
    if (this.portfolioId) {
      this.holdingService.getHoldings(this.portfolioId).subscribe({
        next: (holdings) => {
          this.holdings = holdings;
        },
        error: (error) => {
          console.error('Error loading holdings:', error);
        }
      });
    }
  }

  refresh(): void {
    this.loadHoldings();
  }

  getGainLossDisplay(holding: Holding): string {
    if (!holding.currentPrice) return 'N/A';
    
    const currentValue = holding.quantity * holding.currentPrice;
    const purchaseValue = holding.quantity * holding.purchasePrice;
    const gainLoss = currentValue - purchaseValue;
    const gainLossPercent = (gainLoss / purchaseValue) * 100;
    
    const sign = gainLoss >= 0 ? '+' : '';
    return `${sign}$${gainLoss.toFixed(2)} (${gainLossPercent.toFixed(2)}%)`;
  }

  editHolding(holding: Holding): void {
    // TODO: Implement edit holding dialog
    console.log('Edit holding:', holding);
  }

  deleteHolding(holding: Holding): void {
    if (confirm(`Are you sure you want to delete ${holding.symbol}?`)) {
      this.holdingService.deleteHolding(holding.id).subscribe({
        next: () => {
          this.loadHoldings();
        },
        error: (error) => {
          console.error('Error deleting holding:', error);
        }
      });
    }
  }
}