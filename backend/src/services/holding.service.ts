import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Holding } from '../entities/holding.entity';
import { CreateHoldingDto } from '../dto/create-holding.dto';
import { UpdateHoldingDto } from '../dto/update-holding.dto';

@Injectable()
export class HoldingService {
  constructor(
    @InjectRepository(Holding)
    private holdingRepository: Repository<Holding>,
  ) {}

  async create(createHoldingDto: CreateHoldingDto): Promise<Holding> {
    const holding = this.holdingRepository.create({
      ...createHoldingDto,
      purchaseDate: new Date(createHoldingDto.purchaseDate),
    });
    return this.holdingRepository.save(holding);
  }

  async findAll(): Promise<Holding[]> {
    return this.holdingRepository.find({
      relations: ['portfolio'],
    });
  }

  async findByPortfolio(portfolioId: string): Promise<Holding[]> {
    return this.holdingRepository.find({
      where: { portfolioId },
      relations: ['portfolio'],
    });
  }

  async findOne(id: string): Promise<Holding> {
    const holding = await this.holdingRepository.findOne({
      where: { id },
      relations: ['portfolio'],
    });
    
    if (!holding) {
      throw new Error(`Holding with ID ${id} not found`);
    }
    
    return holding;
  }

  async update(id: string, updateHoldingDto: UpdateHoldingDto): Promise<Holding> {
    const updateData: any = { ...updateHoldingDto };
    if (updateHoldingDto.purchaseDate) {
      updateData.purchaseDate = new Date(updateHoldingDto.purchaseDate);
    }
    
    await this.holdingRepository.update(id, updateData);
    return this.findOne(id);
  }

  async remove(id: string): Promise<void> {
    const result = await this.holdingRepository.delete(id);
    if (result.affected === 0) {
      throw new Error(`Holding with ID ${id} not found`);
    }
  }

  async updateCurrentPrice(id: string, currentPrice: number): Promise<Holding> {
    await this.holdingRepository.update(id, { currentPrice });
    return this.findOne(id);
  }

  async updateCurrentPrices(priceUpdates: { id: string; currentPrice: number }[]): Promise<void> {
    const promises = priceUpdates.map(update => 
      this.holdingRepository.update(update.id, { currentPrice: update.currentPrice })
    );
    await Promise.all(promises);
  }
}