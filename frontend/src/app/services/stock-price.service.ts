import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface StockQuote {
  symbol: string;
  price: number;
  change: number;
  changePercent: number;
  marketCap?: number;
  volume?: number;
  avgVolume?: number;
  pe?: number;
  eps?: number;
  dividendYield?: number;
  lastUpdated: Date;
}

export interface StockSearchResult {
  symbol: string;
  shortname: string;
  longname: string;
  exchange: string;
  sector?: string;
  industry?: string;
}

export interface PriceUpdateResult {
  message: string;
  updatedCount: number;
  totalHoldings: number;
  quotes: StockQuote[];
}

@Injectable({
  providedIn: 'root'
})
export class StockPriceService {
  private apiUrl = 'http://localhost:3000/stocks';

  constructor(private http: HttpClient) { }

  getStockQuote(symbol: string): Observable<StockQuote> {
    return this.http.get<StockQuote>(`${this.apiUrl}/quote/${symbol}`);
  }

  getMultipleStockQuotes(symbols: string[]): Observable<StockQuote[]> {
    return this.http.post<StockQuote[]>(`${this.apiUrl}/quotes`, { symbols });
  }

  searchStocks(query: string): Observable<StockSearchResult[]> {
    return this.http.get<StockSearchResult[]>(`${this.apiUrl}/search`, {
      params: { q: query }
    });
  }

  updatePortfolioPrices(portfolioId: string): Observable<PriceUpdateResult> {
    return this.http.post<PriceUpdateResult>(`${this.apiUrl}/update-prices/${portfolioId}`, {});
  }
}