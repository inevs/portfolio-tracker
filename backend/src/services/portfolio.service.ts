import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Portfolio } from '../entities/portfolio.entity';
import { CreatePortfolioDto } from '../dto/create-portfolio.dto';
import { UpdatePortfolioDto } from '../dto/update-portfolio.dto';

@Injectable()
export class PortfolioService {
  constructor(
    @InjectRepository(Portfolio)
    private portfolioRepository: Repository<Portfolio>,
  ) {}

  async create(createPortfolioDto: CreatePortfolioDto): Promise<Portfolio> {
    const portfolio = this.portfolioRepository.create(createPortfolioDto);
    return this.portfolioRepository.save(portfolio);
  }

  async findAll(): Promise<Portfolio[]> {
    return this.portfolioRepository.find({
      relations: ['holdings'],
    });
  }

  async findOne(id: string): Promise<Portfolio> {
    const portfolio = await this.portfolioRepository.findOne({
      where: { id },
      relations: ['holdings'],
    });
    
    if (!portfolio) {
      throw new Error(`Portfolio with ID ${id} not found`);
    }
    
    return portfolio;
  }

  async update(id: string, updatePortfolioDto: UpdatePortfolioDto): Promise<Portfolio> {
    await this.portfolioRepository.update(id, updatePortfolioDto);
    return this.findOne(id);
  }

  async remove(id: string): Promise<void> {
    const result = await this.portfolioRepository.delete(id);
    if (result.affected === 0) {
      throw new Error(`Portfolio with ID ${id} not found`);
    }
  }

  async getPortfolioSummary(id: string) {
    const portfolio = await this.findOne(id);
    
    const totalValue = portfolio.holdings.reduce((sum, holding) => {
      return sum + (holding.currentPrice ? holding.quantity * holding.currentPrice : 0);
    }, 0);

    const totalPurchaseValue = portfolio.holdings.reduce((sum, holding) => {
      return sum + (holding.quantity * holding.purchasePrice);
    }, 0);

    const totalGainLoss = totalValue - totalPurchaseValue;
    const totalGainLossPercentage = totalPurchaseValue > 0 ? (totalGainLoss / totalPurchaseValue) * 100 : 0;

    return {
      portfolio,
      summary: {
        totalValue,
        totalPurchaseValue,
        totalGainLoss,
        totalGainLossPercentage,
        holdingsCount: portfolio.holdings.length,
      },
    };
  }
}