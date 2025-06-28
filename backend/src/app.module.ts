import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { Portfolio } from './portfolio/portfolio.entity';
import { Holding } from './holdings/holding.entity';
import { Transaction } from './shared/transaction.entity';
import { PortfolioController } from './portfolio/portfolio.controller';
import { HoldingController } from './holdings/holding.controller';
import { StockPriceController } from './stock-prices/stock-price.controller';
import { PortfolioService } from './portfolio/portfolio.service';
import { HoldingService } from './holdings/holding.service';
import { StockPriceService } from './stock-prices/stock-price.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: 'portfolio.db',
      entities: [Portfolio, Holding, Transaction],
      synchronize: true, // Only for development
      logging: true,
    }),
    TypeOrmModule.forFeature([Portfolio, Holding, Transaction]),
  ],
  controllers: [AppController, PortfolioController, HoldingController, StockPriceController],
  providers: [AppService, PortfolioService, HoldingService, StockPriceService],
})
export class AppModule {}
