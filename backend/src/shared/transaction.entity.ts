import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Holding } from '../holdings/holding.entity';

export enum TransactionType {
  BUY = 'buy',
  SELL = 'sell',
  DIVIDEND = 'dividend'
}

@Entity('transactions')
export class Transaction {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    type: 'simple-enum',
    enum: TransactionType
  })
  type: TransactionType;

  @Column('decimal', { precision: 10, scale: 2 })
  quantity: number;

  @Column('decimal', { precision: 10, scale: 4 })
  price: number;

  @Column('decimal', { precision: 10, scale: 2 })
  totalAmount: number;

  @Column('decimal', { precision: 10, scale: 2, default: 0 })
  fees: number;

  @Column('date')
  date: Date;

  @Column({ nullable: true })
  notes?: string;

  @ManyToOne(() => Holding, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'holdingId' })
  holding: Holding;

  @Column('uuid')
  holdingId: string;

  @CreateDateColumn()
  createdAt: Date;
}