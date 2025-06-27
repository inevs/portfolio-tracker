import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatDialogRef, MatDialogModule, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { CreateHoldingDto } from '../../models/portfolio.model';
import { StockPriceService, StockSearchResult } from '../../services/stock-price.service';
import { Observable, of, Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, switchMap, catchError } from 'rxjs/operators';

@Component({
  selector: 'app-add-holding-dialog',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatAutocompleteModule
  ],
  template: `
    <h2 mat-dialog-title>Add New Holding</h2>
    <mat-dialog-content>
      <form #holdingForm="ngForm">
        <mat-form-field class="full-width">
          <mat-label>Stock Symbol</mat-label>
          <input matInput [(ngModel)]="holding.symbol" name="symbol" required 
                 placeholder="e.g., AAPL" style="text-transform: uppercase"
                 [matAutocomplete]="symbolAuto" (input)="onSymbolSearch($event)">
          <mat-autocomplete #symbolAuto="matAutocomplete" (optionSelected)="onStockSelected($event)">
            <mat-option *ngFor="let stock of searchResults$ | async" [value]="stock.symbol">
              <div>
                <strong>{{ stock.symbol }}</strong> - {{ stock.shortname }}
                <br>
                <small>{{ stock.exchange }} {{ stock.sector ? '• ' + stock.sector : '' }}</small>
              </div>
            </mat-option>
          </mat-autocomplete>
        </mat-form-field>
        
        <mat-form-field class="full-width">
          <mat-label>Company Name</mat-label>
          <input matInput [(ngModel)]="holding.companyName" name="companyName" required
                 placeholder="e.g., Apple Inc.">
        </mat-form-field>
        
        <div class="row">
          <mat-form-field class="half-width">
            <mat-label>Quantity</mat-label>
            <input matInput type="number" [(ngModel)]="holding.quantity" name="quantity" 
                   required min="0" step="0.01">
          </mat-form-field>
          
          <mat-form-field class="half-width">
            <mat-label>Purchase Price</mat-label>
            <input matInput type="number" [(ngModel)]="holding.purchasePrice" name="purchasePrice" 
                   required min="0" step="0.01" placeholder="0.00">
            <span matTextPrefix>$&nbsp;</span>
          </mat-form-field>
        </div>
        
        <mat-form-field class="full-width">
          <mat-label>Purchase Date</mat-label>
          <input matInput [matDatepicker]="picker" [(ngModel)]="purchaseDate" name="purchaseDate" required>
          <mat-datepicker-toggle matIconSuffix [for]="picker"></mat-datepicker-toggle>
          <mat-datepicker #picker></mat-datepicker>
        </mat-form-field>
        
        <div class="row">
          <mat-form-field class="half-width">
            <mat-label>Sector (Optional)</mat-label>
            <input matInput [(ngModel)]="holding.sector" name="sector" 
                   placeholder="e.g., Technology">
          </mat-form-field>
          
          <mat-form-field class="half-width">
            <mat-label>Currency</mat-label>
            <input matInput [(ngModel)]="holding.currency" name="currency" 
                   placeholder="USD" value="USD">
          </mat-form-field>
        </div>
      </form>
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button (click)="onCancel()">Cancel</button>
      <button mat-raised-button color="primary" 
              [disabled]="!holding.symbol || !holding.companyName || !holding.quantity || !holding.purchasePrice || !purchaseDate" 
              (click)="onCreate()">
        Add Holding
      </button>
    </mat-dialog-actions>
  `,
  styles: [`
    .full-width {
      width: 100%;
      margin-bottom: 16px;
    }
    .half-width {
      width: calc(50% - 8px);
      margin-bottom: 16px;
    }
    .row {
      display: flex;
      gap: 16px;
    }
    mat-dialog-content {
      min-width: 500px;
      max-height: 600px;
      overflow-y: auto;
    }
  `]
})
export class AddHoldingDialogComponent {
  holding: Omit<CreateHoldingDto, 'portfolioId' | 'purchaseDate'> = {
    symbol: '',
    companyName: '',
    quantity: 0,
    purchasePrice: 0,
    sector: '',
    currency: 'USD'
  };
  
  purchaseDate: Date = new Date();
  private searchSubject = new Subject<string>();
  searchResults$: Observable<StockSearchResult[]>;

  constructor(
    private dialogRef: MatDialogRef<AddHoldingDialogComponent>,
    private stockPriceService: StockPriceService,
    @Inject(MAT_DIALOG_DATA) public data: { portfolioId: string }
  ) {
    this.searchResults$ = this.searchSubject.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      switchMap(query => {
        if (query.length < 2) {
          return of([]);
        }
        return this.stockPriceService.searchStocks(query).pipe(
          catchError(() => of([]))
        );
      })
    );
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  onSymbolSearch(event: any): void {
    const query = event.target.value;
    this.searchSubject.next(query);
  }

  onStockSelected(event: any): void {
    const selectedSymbol = event.option.value;
    this.stockPriceService.searchStocks(selectedSymbol).subscribe({
      next: (results) => {
        const stock = results.find(r => r.symbol === selectedSymbol);
        if (stock) {
          this.holding.symbol = stock.symbol;
          this.holding.companyName = stock.shortname || stock.longname || '';
          this.holding.sector = stock.sector || '';
        }
      },
      error: (error) => {
        console.error('Error getting stock details:', error);
      }
    });
  }

  onCreate(): void {
    if (this.holding.symbol && this.holding.companyName && this.holding.quantity && this.holding.purchasePrice && this.purchaseDate) {
      const holdingData: CreateHoldingDto = {
        ...this.holding,
        symbol: this.holding.symbol.toUpperCase(),
        portfolioId: this.data.portfolioId,
        purchaseDate: this.purchaseDate.toISOString().split('T')[0] // Format as YYYY-MM-DD
      };
      this.dialogRef.close(holdingData);
    }
  }
}