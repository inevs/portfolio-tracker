import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { CreatePortfolioDto } from '../../models/portfolio.model';

@Component({
  selector: 'app-create-portfolio-dialog',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule
  ],
  template: `
    <h2 mat-dialog-title>Create New Portfolio</h2>
    <mat-dialog-content>
      <form #portfolioForm="ngForm">
        <mat-form-field class="full-width">
          <mat-label>Portfolio Name</mat-label>
          <input matInput [(ngModel)]="portfolio.name" name="name" required>
        </mat-form-field>
        
        <mat-form-field class="full-width">
          <mat-label>Description (Optional)</mat-label>
          <textarea matInput [(ngModel)]="portfolio.description" name="description" rows="3"></textarea>
        </mat-form-field>
      </form>
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button (click)="onCancel()">Cancel</button>
      <button mat-raised-button color="primary" [disabled]="!portfolio.name" (click)="onCreate()">
        Create
      </button>
    </mat-dialog-actions>
  `,
  styles: [`
    .full-width {
      width: 100%;
      margin-bottom: 16px;
    }
    mat-dialog-content {
      min-width: 400px;
    }
  `]
})
export class CreatePortfolioDialogComponent {
  portfolio: CreatePortfolioDto = {
    name: '',
    description: ''
  };

  constructor(
    private dialogRef: MatDialogRef<CreatePortfolioDialogComponent>
  ) {}

  onCancel(): void {
    this.dialogRef.close();
  }

  onCreate(): void {
    if (this.portfolio.name.trim()) {
      this.dialogRef.close(this.portfolio);
    }
  }
}