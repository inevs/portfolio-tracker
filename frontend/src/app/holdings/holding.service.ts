import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Holding, CreateHoldingDto } from '../shared/models/portfolio.model';

@Injectable({
  providedIn: 'root'
})
export class HoldingService {
  private apiUrl = 'http://localhost:3000/holdings';

  constructor(private http: HttpClient) { }

  getHoldings(portfolioId?: string): Observable<Holding[]> {
    let params = new HttpParams();
    if (portfolioId) {
      params = params.set('portfolioId', portfolioId);
    }
    return this.http.get<Holding[]>(this.apiUrl, { params });
  }

  getHolding(id: string): Observable<Holding> {
    return this.http.get<Holding>(`${this.apiUrl}/${id}`);
  }

  createHolding(holding: CreateHoldingDto): Observable<Holding> {
    return this.http.post<Holding>(this.apiUrl, holding);
  }

  updateHolding(id: string, holding: Partial<CreateHoldingDto>): Observable<Holding> {
    return this.http.patch<Holding>(`${this.apiUrl}/${id}`, holding);
  }

  updateHoldingPrice(id: string, currentPrice: number): Observable<Holding> {
    return this.http.patch<Holding>(`${this.apiUrl}/${id}/price`, { currentPrice });
  }

  deleteHolding(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}