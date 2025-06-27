import { IsString, IsNumber, IsDateString, IsOptional, IsNotEmpty, IsUUID } from 'class-validator';

export class CreateHoldingDto {
  @IsString()
  @IsNotEmpty()
  symbol: string;

  @IsString()
  @IsNotEmpty()
  companyName: string;

  @IsNumber()
  quantity: number;

  @IsNumber()
  purchasePrice: number;

  @IsDateString()
  purchaseDate: string;

  @IsString()
  @IsOptional()
  sector?: string;

  @IsString()
  @IsOptional()
  currency?: string;

  @IsUUID()
  portfolioId: string;
}