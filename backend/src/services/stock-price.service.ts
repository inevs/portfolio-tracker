import { Injectable, Logger } from '@nestjs/common';
import axios from 'axios';

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

@Injectable()
export class StockPriceService {
  private readonly logger = new Logger(StockPriceService.name);
  private readonly baseUrl = 'https://query1.finance.yahoo.com/v8/finance/chart';

  async getStockPrice(symbol: string): Promise<StockQuote | null> {
    try {
      const response = await axios.get(`${this.baseUrl}/${symbol}`, {
        params: {
          interval: '1d',
          range: '1d'
        },
        timeout: 10000
      });

      const data = response.data;
      
      if (!data.chart?.result?.[0]) {
        this.logger.warn(`No data found for symbol: ${symbol}`);
        return null;
      }

      const result = data.chart.result[0];
      const meta = result.meta;
      const quote = result.indicators?.quote?.[0];

      if (!meta || !quote) {
        this.logger.warn(`Invalid data structure for symbol: ${symbol}`);
        return null;
      }

      const currentPrice = meta.regularMarketPrice || meta.previousClose;
      const previousClose = meta.previousClose;
      const change = currentPrice - previousClose;
      const changePercent = (change / previousClose) * 100;

      return {
        symbol: symbol.toUpperCase(),
        price: currentPrice,
        change: change,
        changePercent: changePercent,
        marketCap: meta.marketCap,
        volume: meta.regularMarketVolume,
        avgVolume: meta.averageDailyVolume10Day,
        lastUpdated: new Date()
      };
    } catch (error) {
      this.logger.error(`Error fetching stock price for ${symbol}:`, error.message);
      return null;
    }
  }

  async getMultipleStockPrices(symbols: string[]): Promise<StockQuote[]> {
    const quotes: StockQuote[] = [];
    
    // Process in batches to avoid overwhelming the API
    const batchSize = 5;
    for (let i = 0; i < symbols.length; i += batchSize) {
      const batch = symbols.slice(i, i + batchSize);
      const batchPromises = batch.map(symbol => this.getStockPrice(symbol));
      
      try {
        const batchResults = await Promise.allSettled(batchPromises);
        batchResults.forEach((result, index) => {
          if (result.status === 'fulfilled' && result.value) {
            quotes.push(result.value);
          } else {
            this.logger.warn(`Failed to get price for ${batch[index]}`);
          }
        });
        
        // Add small delay between batches to be respectful to the API
        if (i + batchSize < symbols.length) {
          await new Promise(resolve => setTimeout(resolve, 100));
        }
      } catch (error) {
        this.logger.error('Error processing batch:', error);
      }
    }

    return quotes;
  }

  async searchStock(query: string): Promise<any[]> {
    try {
      const response = await axios.get('https://query1.finance.yahoo.com/v1/finance/search', {
        params: {
          q: query,
          quotesCount: 10,
          newsCount: 0
        },
        timeout: 10000
      });

      return response.data.quotes?.map((quote: any) => ({
        symbol: quote.symbol,
        shortname: quote.shortname,
        longname: quote.longname,
        exchange: quote.exchange,
        sector: quote.sector,
        industry: quote.industry
      })) || [];
    } catch (error) {
      this.logger.error(`Error searching for stocks with query "${query}":`, error.message);
      return [];
    }
  }
}