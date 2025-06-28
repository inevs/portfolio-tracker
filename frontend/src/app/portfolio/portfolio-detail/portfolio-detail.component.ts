import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { Portfolio, PortfolioSummary } from '../../shared/models/portfolio.model';
import { PortfolioService } from '../portfolio.service';
import { HoldingService } from '../../holdings/holding.service';
import { StockPriceService } from '../../stock-prices/stock-price.service';
import { HoldingListComponent } from '../../holdings/holding-list/holding-list.component';
import { AddHoldingDialogComponent } from '../../holdings/add-holding-dialog/add-holding-dialog.component';

@Component({
  selector: 'app-portfolio-detail',
  imports: [
    CommonModule, 
    CardModule, 
    ButtonModule, 
    ProgressSpinnerModule,
    ToastModule,
    HoldingListComponent
  ],
  templateUrl: './portfolio-detail.component.html',
  styleUrl: './portfolio-detail.component.css'
})
export class PortfolioDetailComponent implements OnInit {
  @ViewChild(HoldingListComponent) holdingListComponent!: HoldingListComponent;
  
  portfolio: Portfolio | null = null;
  summary: PortfolioSummary['summary'] | null = null;
  loading = true;
  updatingPrices = false;

  constructor(
    private route: ActivatedRoute,
    private portfolioService: PortfolioService,
    private holdingService: HoldingService,
    private stockPriceService: StockPriceService,
    private dialogService: DialogService,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.loadPortfolioSummary(id);
    }
  }

  loadPortfolioSummary(id: string): void {
    this.loading = true;
    this.portfolioService.getPortfolioSummary(id).subscribe({
      next: (data) => {
        this.portfolio = data.portfolio;
        this.summary = data.summary;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading portfolio:', error);
        this.loading = false;
      }
    });
  }

  addHolding(): void {
    if (!this.portfolio) return;

    const dialogRef = this.dialogService.open(AddHoldingDialogComponent, {
      header: 'Add Holding',
      width: '500px',
      data: { portfolioId: this.portfolio.id }
    });

    dialogRef.onClose.subscribe(result => {
      if (result) {
        this.holdingService.createHolding(result).subscribe({
          next: (holding) => {
            this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Holding added successfully' });
            // Reload the portfolio summary to get updated data
            this.loadPortfolioSummary(this.portfolio!.id);
            // Refresh the holdings list
            if (this.holdingListComponent) {
              this.holdingListComponent.refresh();
            }
          },
          error: (error) => {
            console.error('Error adding holding:', error);
            this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Error adding holding' });
          }
        });
      }
    });
  }

  updatePrices(): void {
    if (!this.portfolio) return;

    this.updatingPrices = true;
    this.stockPriceService.updatePortfolioPrices(this.portfolio.id).subscribe({
      next: (result) => {
        this.updatingPrices = false;
        this.messageService.add({ 
          severity: 'success', 
          summary: 'Success', 
          detail: `${result.message}. Updated ${result.updatedCount} holdings.` 
        });
        // Reload the portfolio summary to show updated values
        this.loadPortfolioSummary(this.portfolio!.id);
        // Refresh the holdings list to show updated prices
        if (this.holdingListComponent) {
          this.holdingListComponent.refresh();
        }
      },
      error: (error) => {
        this.updatingPrices = false;
        console.error('Error updating prices:', error);
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Error updating stock prices' });
      }
    });
  }
}