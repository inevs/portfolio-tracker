import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { HoldingService } from '../services/holding.service';
import { CreateHoldingDto } from '../dto/create-holding.dto';
import { UpdateHoldingDto } from '../dto/update-holding.dto';

@Controller('holdings')
export class HoldingController {
  constructor(private readonly holdingService: HoldingService) {}

  @Post()
  async create(@Body() createHoldingDto: CreateHoldingDto) {
    try {
      return await this.holdingService.create(createHoldingDto);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  @Get()
  async findAll(@Query('portfolioId') portfolioId?: string) {
    try {
      if (portfolioId) {
        return await this.holdingService.findByPortfolio(portfolioId);
      }
      return await this.holdingService.findAll();
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    try {
      return await this.holdingService.findOne(id);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.NOT_FOUND);
    }
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateHoldingDto: UpdateHoldingDto) {
    try {
      return await this.holdingService.update(id, updateHoldingDto);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  @Patch(':id/price')
  async updatePrice(@Param('id') id: string, @Body('currentPrice') currentPrice: number) {
    try {
      return await this.holdingService.updateCurrentPrice(id, currentPrice);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    try {
      await this.holdingService.remove(id);
      return { message: 'Holding deleted successfully' };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.NOT_FOUND);
    }
  }
}