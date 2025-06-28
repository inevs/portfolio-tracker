import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Query,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { StockPriceService } from './stock-price.service';
import { HoldingService } from '../holdings/holding.service';

@Controller('stocks')
export class StockPriceController {
  constructor(
    private readonly stockPriceService: StockPriceService,
    private readonly holdingService: HoldingService,
  ) {}

  @Get('quote/:symbol')
  async getStockQuote(@Param('symbol') symbol: string) {
    try {
      const quote = await this.stockPriceService.getStockPrice(symbol);
      if (!quote) {
        throw new HttpException('Stock not found', HttpStatus.NOT_FOUND);
      }
      return quote;
    } catch (error) {
      throw new HttpException(
        error.message || 'Error fetching stock quote',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Post('quotes')
  async getMultipleStockQuotes(@Body('symbols') symbols: string[]) {
    try {
      if (!symbols || !Array.isArray(symbols) || symbols.length === 0) {
        throw new HttpException('Invalid symbols array', HttpStatus.BAD_REQUEST);
      }
      
      const quotes = await this.stockPriceService.getMultipleStockPrices(symbols);
      return quotes;
    } catch (error) {
      throw new HttpException(
        error.message || 'Error fetching stock quotes',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get('search')
  async searchStocks(@Query('q') query: string) {
    try {
      if (!query || query.trim().length === 0) {
        throw new HttpException('Search query is required', HttpStatus.BAD_REQUEST);
      }
      
      const results = await this.stockPriceService.searchStock(query);
      return results;
    } catch (error) {
      throw new HttpException(
        error.message || 'Error searching stocks',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Post('update-prices/:portfolioId')
  async updatePortfolioPrices(@Param('portfolioId') portfolioId: string) {
    try {
      // Get all holdings for the portfolio
      const holdings = await this.holdingService.findByPortfolio(portfolioId);
      
      if (holdings.length === 0) {
        return { message: 'No holdings to update', updatedCount: 0 };
      }

      // Get unique symbols
      const symbols = [...new Set(holdings.map(h => h.symbol))];
      
      // Fetch current prices
      const quotes = await this.stockPriceService.getMultipleStockPrices(symbols);
      
      // Update holdings with current prices
      const updatePromises = holdings.map(holding => {
        const quote = quotes.find(q => q.symbol === holding.symbol.toUpperCase());
        if (quote) {
          return this.holdingService.updateCurrentPrice(holding.id, quote.price);
        }
        return Promise.resolve(null);
      });

      const results = await Promise.allSettled(updatePromises);
      const successCount = results.filter(r => r.status === 'fulfilled' && r.value).length;

      return {
        message: `Updated ${successCount} of ${holdings.length} holdings`,
        updatedCount: successCount,
        totalHoldings: holdings.length,
        quotes: quotes
      };
    } catch (error) {
      throw new HttpException(
        error.message || 'Error updating portfolio prices',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}