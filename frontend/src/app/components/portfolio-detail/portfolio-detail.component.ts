import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { Portfolio, PortfolioSummary } from '../../models/portfolio.model';
import { PortfolioService } from '../../services/portfolio.service';
import { HoldingService } from '../../services/holding.service';
import { StockPriceService } from '../../services/stock-price.service';
import { HoldingListComponent } from '../holding-list/holding-list.component';
import { AddHoldingDialogComponent } from '../add-holding-dialog/add-holding-dialog.component';

@Component({
  selector: 'app-portfolio-detail',
  imports: [
    CommonModule, 
    MatCardModule, 
    MatButtonModule, 
    MatIconModule, 
    MatProgressSpinnerModule,
    MatDialogModule,
    MatSnackBarModule,
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
    private dialog: MatDialog,
    private snackBar: MatSnackBar
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

    const dialogRef = this.dialog.open(AddHoldingDialogComponent, {
      data: { portfolioId: this.portfolio.id }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.holdingService.createHolding(result).subscribe({
          next: (holding) => {
            this.snackBar.open('Holding added successfully', 'Close', { duration: 3000 });
            // Reload the portfolio summary to get updated data
            this.loadPortfolioSummary(this.portfolio!.id);
            // Refresh the holdings list
            if (this.holdingListComponent) {
              this.holdingListComponent.refresh();
            }
          },
          error: (error) => {
            console.error('Error adding holding:', error);
            this.snackBar.open('Error adding holding', 'Close', { duration: 3000 });
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
        this.snackBar.open(
          `${result.message}. Updated ${result.updatedCount} holdings.`, 
          'Close', 
          { duration: 5000 }
        );
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
        this.snackBar.open('Error updating stock prices', 'Close', { duration: 3000 });
      }
    });
  }
}