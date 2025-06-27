import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Portfolio } from './portfolio.entity';

@Entity('holdings')
export class Holding {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  symbol: string;

  @Column()
  companyName: string;

  @Column('decimal', { precision: 10, scale: 2 })
  quantity: number;

  @Column('decimal', { precision: 10, scale: 4 })
  purchasePrice: number;

  @Column('date')
  purchaseDate: Date;

  @Column('decimal', { precision: 10, scale: 4, nullable: true })
  currentPrice?: number;

  @Column({ nullable: true })
  sector?: string;

  @Column({ nullable: true })
  currency?: string;

  @ManyToOne(() => Portfolio, portfolio => portfolio.holdings, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'portfolioId' })
  portfolio: Portfolio;

  @Column('uuid')
  portfolioId: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  // Calculated fields (not stored in database)
  get currentValue(): number {
    return this.currentPrice ? this.quantity * this.currentPrice : 0;
  }

  get purchaseValue(): number {
    return this.quantity * this.purchasePrice;
  }

  get gainLoss(): number {
    return this.currentValue - this.purchaseValue;
  }

  get gainLossPercentage(): number {
    return this.purchaseValue > 0 ? (this.gainLoss / this.purchaseValue) * 100 : 0;
  }
}