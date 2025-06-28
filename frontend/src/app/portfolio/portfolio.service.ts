import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Portfolio, CreatePortfolioDto, PortfolioSummary } from '../shared/models/portfolio.model';

@Injectable({
  providedIn: 'root'
})
export class PortfolioService {
  private apiUrl = 'http://localhost:3000/portfolios';

  constructor(private http: HttpClient) { }

  getPortfolios(): Observable<Portfolio[]> {
    return this.http.get<Portfolio[]>(this.apiUrl);
  }

  getPortfolio(id: string): Observable<Portfolio> {
    return this.http.get<Portfolio>(`${this.apiUrl}/${id}`);
  }

  getPortfolioSummary(id: string): Observable<PortfolioSummary> {
    return this.http.get<PortfolioSummary>(`${this.apiUrl}/${id}/summary`);
  }

  createPortfolio(portfolio: CreatePortfolioDto): Observable<Portfolio> {
    return this.http.post<Portfolio>(this.apiUrl, portfolio);
  }

  updatePortfolio(id: string, portfolio: Partial<CreatePortfolioDto>): Observable<Portfolio> {
    return this.http.patch<Portfolio>(`${this.apiUrl}/${id}`, portfolio);
  }

  deletePortfolio(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}