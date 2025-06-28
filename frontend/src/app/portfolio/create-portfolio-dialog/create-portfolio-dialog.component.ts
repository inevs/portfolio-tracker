import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DynamicDialogRef } from 'primeng/dynamicdialog';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextarea } from 'primeng/inputtextarea';
import { CreatePortfolioDto } from '../../shared/models/portfolio.model';

@Component({
  selector: 'app-create-portfolio-dialog',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ButtonModule,
    InputTextModule,
    InputTextarea
  ],
  template: `
    <form #portfolioForm="ngForm" class="portfolio-form">
      <div class="form-group">
        <label for="name">Portfolio Name *</label>
        <input 
          id="name"
          type="text" 
          pInputText 
          [(ngModel)]="portfolio.name" 
          name="name" 
          placeholder="Enter portfolio name"
          required 
          class="full-width">
      </div>
      
      <div class="form-group">
        <label for="description">Description (Optional)</label>
        <textarea 
          id="description"
          pInputTextarea 
          [(ngModel)]="portfolio.description" 
          name="description" 
          placeholder="Enter description"
          rows="3" 
          class="full-width">
        </textarea>
      </div>
      
      <div class="dialog-actions">
        <p-button 
          label="Cancel" 
          severity="secondary" 
          [text]="true"
          (onClick)="onCancel()">
        </p-button>
        <p-button 
          label="Create" 
          [disabled]="!portfolio.name || !portfolio.name.trim()" 
          (onClick)="onCreate()">
        </p-button>
      </div>
    </form>
  `,
  styles: [`
    .portfolio-form {
      padding: 20px;
      min-width: 400px;
    }
    .form-group {
      margin-bottom: 20px;
    }
    .form-group label {
      display: block;
      margin-bottom: 5px;
      font-weight: 500;
    }
    .full-width {
      width: 100%;
    }
    .dialog-actions {
      display: flex;
      justify-content: flex-end;
      gap: 10px;
      margin-top: 20px;
    }
  `]
})
export class CreatePortfolioDialogComponent {
  portfolio: CreatePortfolioDto = {
    name: '',
    description: ''
  };

  constructor(
    private dialogRef: DynamicDialogRef
  ) {}

  onCancel(): void {
    this.dialogRef.close();
  }

  onCreate(): void {
    if (this.portfolio.name && this.portfolio.name.trim()) {
      this.dialogRef.close(this.portfolio);
    }
  }
}