import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import { Portfolio, CreatePortfolioDto } from '../../models/portfolio.model';
import { PortfolioService } from '../../services/portfolio.service';
import { CreatePortfolioDialogComponent } from '../create-portfolio-dialog/create-portfolio-dialog.component';

@Component({
  selector: 'app-portfolio-list',
  imports: [CommonModule, MatCardModule, MatButtonModule, MatIconModule, MatDialogModule, MatSnackBarModule],
  templateUrl: './portfolio-list.component.html',
  styleUrl: './portfolio-list.component.css'
})
export class PortfolioListComponent implements OnInit {
  portfolios: Portfolio[] = [];
  loading = true;

  constructor(
    private portfolioService: PortfolioService,
    private router: Router,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.loadPortfolios();
  }

  loadPortfolios(): void {
    this.loading = true;
    this.portfolioService.getPortfolios().subscribe({
      next: (portfolios) => {
        this.portfolios = portfolios;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading portfolios:', error);
        this.snackBar.open('Error loading portfolios', 'Close', { duration: 3000 });
        this.loading = false;
      }
    });
  }

  navigateToPortfolio(id: string): void {
    this.router.navigate(['/portfolios', id]);
  }

  openCreateDialog(): void {
    const dialogRef = this.dialog.open(CreatePortfolioDialogComponent);

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.portfolioService.createPortfolio(result).subscribe({
          next: (portfolio) => {
            this.snackBar.open('Portfolio created successfully', 'Close', { duration: 3000 });
            this.loadPortfolios();
          },
          error: (error) => {
            console.error('Error creating portfolio:', error);
            this.snackBar.open('Error creating portfolio', 'Close', { duration: 3000 });
          }
        });
      }
    });
  }

  editPortfolio(portfolio: Portfolio, event: Event): void {
    event.stopPropagation();
    // TODO: Implement edit portfolio dialog
    console.log('Edit portfolio:', portfolio);
  }

  deletePortfolio(id: string, event: Event): void {
    event.stopPropagation();
    if (confirm('Are you sure you want to delete this portfolio?')) {
      this.portfolioService.deletePortfolio(id).subscribe({
        next: () => {
          this.snackBar.open('Portfolio deleted successfully', 'Close', { duration: 3000 });
          this.loadPortfolios();
        },
        error: (error) => {
          console.error('Error deleting portfolio:', error);
          this.snackBar.open('Error deleting portfolio', 'Close', { duration: 3000 });
        }
      });
    }
  }
}