import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { FormsModule } from '@angular/forms';
import { Portfolio, CreatePortfolioDto } from '../../shared/models/portfolio.model';
import { PortfolioService } from '../portfolio.service';
import { CreatePortfolioDialogComponent } from '../create-portfolio-dialog/create-portfolio-dialog.component';

@Component({
  selector: 'app-portfolio-list',
  imports: [CommonModule, CardModule, ButtonModule, ToastModule],
  templateUrl: './portfolio-list.component.html',
  styleUrl: './portfolio-list.component.css'
})
export class PortfolioListComponent implements OnInit {
  portfolios: Portfolio[] = [];
  loading = true;

  constructor(
    private portfolioService: PortfolioService,
    private router: Router,
    private dialogService: DialogService,
    private messageService: MessageService
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
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Error loading portfolios' });
        this.loading = false;
      }
    });
  }

  navigateToPortfolio(id: string): void {
    this.router.navigate(['/portfolios', id]);
  }

  openCreateDialog(): void {
    const dialogRef = this.dialogService.open(CreatePortfolioDialogComponent, {
      header: 'Create Portfolio',
      width: '400px'
    });

    dialogRef.onClose.subscribe(result => {
      if (result) {
        this.portfolioService.createPortfolio(result).subscribe({
          next: (portfolio) => {
            this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Portfolio created successfully' });
            this.loadPortfolios();
          },
          error: (error) => {
            console.error('Error creating portfolio:', error);
            this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Error creating portfolio' });
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
          this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Portfolio deleted successfully' });
          this.loadPortfolios();
        },
        error: (error) => {
          console.error('Error deleting portfolio:', error);
          this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Error deleting portfolio' });
        }
      });
    }
  }
}