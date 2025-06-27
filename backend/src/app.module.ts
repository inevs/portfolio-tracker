import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { Portfolio, Holding, Transaction } from './entities';
import { PortfolioController } from './controllers/portfolio.controller';
import { HoldingController } from './controllers/holding.controller';
import { StockPriceController } from './controllers/stock-price.controller';
import { PortfolioService } from './services/portfolio.service';
import { HoldingService } from './services/holding.service';
import { StockPriceService } from './services/stock-price.service';

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
