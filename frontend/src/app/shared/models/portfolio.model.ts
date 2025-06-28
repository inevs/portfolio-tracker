export interface Portfolio {
  id: string;
  name: string;
  description?: string;
  holdings: Holding[];
  createdAt: Date;
  updatedAt: Date;
}

export interface Holding {
  id: string;
  symbol: string;
  companyName: string;
  quantity: number;
  purchasePrice: number;
  purchaseDate: Date;
  currentPrice?: number;
  sector?: string;
  currency?: string;
  portfolioId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreatePortfolioDto {
  name: string;
  description?: string;
}

export interface CreateHoldingDto {
  symbol: string;
  companyName: string;
  quantity: number;
  purchasePrice: number;
  purchaseDate: string;
  sector?: string;
  currency?: string;
  portfolioId: string;
}

export interface PortfolioSummary {
  portfolio: Portfolio;
  summary: {
    totalValue: number;
    totalPurchaseValue: number;
    totalGainLoss: number;
    totalGainLossPercentage: number;
    holdingsCount: number;
  };
}