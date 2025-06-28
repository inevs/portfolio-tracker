import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DynamicDialogRef, DynamicDialogConfig } from 'primeng/dynamicdialog';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { InputNumberModule } from 'primeng/inputnumber';
import { CalendarModule } from 'primeng/calendar';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { CreateHoldingDto } from '../../shared/models/portfolio.model';
import { StockPriceService, StockSearchResult } from '../../stock-prices/stock-price.service';
import { Observable, of, Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, switchMap, catchError } from 'rxjs/operators';

@Component({
  selector: 'app-add-holding-dialog',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ButtonModule,
    InputTextModule,
    InputNumberModule,
    CalendarModule,
    AutoCompleteModule
  ],
  template: `
    <form #holdingForm="ngForm" class="holding-form">
      <div class="form-group">
        <label for="symbol">Stock Symbol *</label>
        <p-autoComplete 
          [(ngModel)]="holding.symbol"
          name="symbol"
          [suggestions]="filteredStocks"
          (completeMethod)="searchStocks($event)"
          (onSelect)="onStockSelected($event)"
          field="symbol"
          placeholder="e.g., AAPL"
          styleClass="full-width"
          [inputStyle]="{'text-transform': 'uppercase'}"
          required>
          <ng-template let-stock pTemplate="item">
            <div>
              <strong>{{ stock.symbol }}</strong> - {{ stock.shortname }}
              <br>
              <small>{{ stock.exchange }} {{ stock.sector ? '• ' + stock.sector : '' }}</small>
            </div>
          </ng-template>
        </p-autoComplete>
      </div>
      
      <div class="form-group">
        <label for="companyName">Company Name *</label>
        <input 
          id="companyName"
          type="text" 
          pInputText 
          [(ngModel)]="holding.companyName" 
          name="companyName" 
          placeholder="e.g., Apple Inc."
          required 
          class="full-width">
      </div>
      
      <div class="row">
        <div class="form-group half-width">
          <label for="quantity">Quantity *</label>
          <p-inputNumber 
            [(ngModel)]="holding.quantity"
            name="quantity"
            [min]="0"
            [step]="0.01"
            mode="decimal"
            [minFractionDigits]="0"
            [maxFractionDigits]="2"
            placeholder="0"
            styleClass="full-width"
            required>
          </p-inputNumber>
        </div>
        
        <div class="form-group half-width">
          <label for="purchasePrice">Purchase Price *</label>
          <p-inputNumber 
            [(ngModel)]="holding.purchasePrice"
            name="purchasePrice"
            [min]="0"
            [step]="0.01"
            mode="currency"
            currency="USD"
            currencyDisplay="symbol"
            [minFractionDigits]="2"
            [maxFractionDigits]="2"
            placeholder="0.00"
            styleClass="full-width"
            required>
          </p-inputNumber>
        </div>
      </div>
      
      <div class="form-group">
        <label for="purchaseDate">Purchase Date *</label>
        <p-calendar 
          [(ngModel)]="purchaseDate"
          name="purchaseDate"
          [showIcon]="true"
          dateFormat="mm/dd/yy"
          placeholder="Select date"
          styleClass="full-width"
          required>
        </p-calendar>
      </div>
      
      <div class="row">
        <div class="form-group half-width">
          <label for="sector">Sector (Optional)</label>
          <input 
            id="sector"
            type="text" 
            pInputText 
            [(ngModel)]="holding.sector" 
            name="sector" 
            placeholder="e.g., Technology"
            class="full-width">
        </div>
        
        <div class="form-group half-width">
          <label for="currency">Currency</label>
          <input 
            id="currency"
            type="text" 
            pInputText 
            [(ngModel)]="holding.currency" 
            name="currency" 
            placeholder="USD"
            value="USD"
            class="full-width">
        </div>
      </div>
      
      <div class="dialog-actions">
        <p-button 
          label="Cancel" 
          severity="secondary" 
          [text]="true"
          (onClick)="onCancel()">
        </p-button>
        <p-button 
          label="Add Holding" 
          [disabled]="!holding.symbol || !holding.companyName || !holding.quantity || !holding.purchasePrice || !purchaseDate" 
          (onClick)="onCreate()">
        </p-button>
      </div>
    </form>
  `,
  styles: [`
    .holding-form {
      padding: 20px;
      min-width: 500px;
      max-height: 600px;
      overflow-y: auto;
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
    .half-width {
      width: calc(50% - 10px);
    }
    .row {
      display: flex;
      gap: 20px;
    }
    .dialog-actions {
      display: flex;
      justify-content: flex-end;
      gap: 10px;
      margin-top: 20px;
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
  filteredStocks: StockSearchResult[] = [];

  constructor(
    private dialogRef: DynamicDialogRef,
    private config: DynamicDialogConfig,
    private stockPriceService: StockPriceService
  ) {}

  onCancel(): void {
    this.dialogRef.close();
  }

  searchStocks(event: any): void {
    const query = event.query;
    if (query.length >= 2) {
      this.stockPriceService.searchStocks(query).subscribe({
        next: (results) => {
          this.filteredStocks = results;
        },
        error: () => {
          this.filteredStocks = [];
        }
      });
    } else {
      this.filteredStocks = [];
    }
  }

  onStockSelected(event: any): void {
    const stock = event as StockSearchResult;
    if (stock) {
      this.holding.symbol = stock.symbol;
      this.holding.companyName = stock.shortname || stock.longname || '';
      this.holding.sector = stock.sector || '';
    }
  }

  onCreate(): void {
    if (this.holding.symbol && this.holding.companyName && this.holding.quantity && this.holding.purchasePrice && this.purchaseDate) {
      const holdingData: CreateHoldingDto = {
        ...this.holding,
        symbol: this.holding.symbol.toUpperCase(),
        portfolioId: this.config.data?.portfolioId,
        purchaseDate: this.purchaseDate.toISOString().split('T')[0] // Format as YYYY-MM-DD
      };
      this.dialogRef.close(holdingData);
    }
  }
}