# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

### Project-wide Commands (from root directory)
- `npm run dev` - Start both backend and frontend in development mode concurrently
- `npm run build` - Build both backend and frontend for production
- `npm run test` - Run all tests for both backend and frontend

### Backend Commands (NestJS)
- `cd backend && npm run start:dev` - Start backend in watch mode
- `cd backend && npm run lint` - Run ESLint with auto-fix
- `cd backend && npm run test` - Run Jest unit tests
- `cd backend && npm run test:watch` - Run tests in watch mode
- `cd backend && npm run test:e2e` - Run end-to-end tests
- `cd backend && npm run test:cov` - Run tests with coverage report

### Frontend Commands (Angular)
- `cd frontend && ng serve` - Start Angular dev server
- `cd frontend && ng build` - Build for production
- `cd frontend && ng test` - Run Karma/Jasmine tests
- `cd frontend && ng generate component <name>` - Generate new component

## Architecture Overview

### Full-Stack TypeScript Application
This is a monorepo containing a securities portfolio tracking application with:
- **Backend**: NestJS API server with TypeORM and SQLite
- **Frontend**: Angular SPA with Angular Material
- **External API**: Yahoo Finance integration for real-time stock prices

### Backend Architecture (NestJS)

**Database Layer (TypeORM + SQLite)**:
- `Portfolio` entity: Main portfolio container
- `Holding` entity: Individual stock holdings with calculated gain/loss properties
- `Transaction` entity: Transaction history (prepared for future use)
- Entities use UUID primary keys and automatic timestamps

**Service Layer**:
- `PortfolioService`: CRUD operations and portfolio summary calculations
- `HoldingService`: Holdings management with price updates
- `StockPriceService`: Yahoo Finance API integration with batch processing and error handling

**Controller Layer**:
- `PortfolioController`: Portfolio CRUD and summary endpoints
- `HoldingController`: Holdings CRUD and price update endpoints  
- `StockPriceController`: Stock quote, search, and bulk price update endpoints

**Key Backend Patterns**:
- All services use dependency injection
- TypeORM repositories with custom query methods
- DTO classes for request validation with class-validator
- Global exception handling and CORS configuration
- Calculated properties on entities (gain/loss) computed in real-time

### Frontend Architecture (Angular)

**Component Structure**:
- `PortfolioListComponent`: Grid view of all portfolios with creation dialog
- `PortfolioDetailComponent`: Individual portfolio view with summary cards and holdings
- `HoldingListComponent`: Table of holdings with gain/loss calculations
- `AddHoldingDialogComponent`: Modal with stock search autocomplete
- `CreatePortfolioDialogComponent`: Simple portfolio creation modal

**Service Layer**:
- `PortfolioService`: HTTP client for portfolio operations
- `HoldingService`: HTTP client for holdings operations with proper HttpParams
- `StockPriceService`: Stock quotes, search, and bulk price updates

**Key Frontend Patterns**:
- Standalone components (no NgModules)
- Angular Material for consistent UI
- Reactive forms with template-driven approach
- HTTP interceptors configured in app.config.ts
- Observable-based data flow with proper error handling

### API Integration Pattern

**Yahoo Finance Integration**:
- Stock quotes: `GET /stocks/quote/:symbol`
- Bulk quotes: `POST /stocks/quotes` with symbol array
- Stock search: `GET /stocks/search?q=query`
- Portfolio price updates: `POST /stocks/update-prices/:portfolioId`

**Error Handling Strategy**:
- Backend: Try-catch with logging, return null for failed API calls
- Frontend: Subscribe error handlers with user-friendly snackbar messages
- Batch processing with Promise.allSettled for resilience

### Database Design Patterns

**Entity Relationships**:
- Portfolio -> Holding (One-to-Many with cascade delete)
- Holding -> Transaction (One-to-Many, prepared for future)
- All entities have UUID primary keys for scalability

**Calculated Fields**:
- Holdings have computed properties (currentValue, gainLoss, gainLossPercentage)
- Portfolio summaries calculated in service layer, not stored
- Real-time calculations ensure data consistency

### State Management Pattern

**Frontend State**:
- Component-level state with lifecycle hooks
- Parent-child communication via @Input/@Output and ViewChild
- Real-time updates trigger both summary refresh and holdings list refresh
- No global state management (suitable for current scope)

## Important Development Notes

### Database Configuration
- SQLite used for development with `synchronize: true`
- Database file: `portfolio.db` (excluded from git)
- TypeORM logging enabled for development

### CORS Configuration
- Backend configured for `http://localhost:4200`
- Credentials enabled for future authentication

### Stock Price API
- Yahoo Finance endpoints with 10-second timeout
- Batch processing with 100ms delays between requests
- Search includes company name, sector, and exchange data

### Material Design Integration
- Uses Angular Material with Indigo-Pink theme
- Standalone imports pattern for tree-shaking
- Date picker with native date module
- Autocomplete with debounced search

### Common Debugging Commands
- Backend logs show TypeORM queries and stock API calls
- Frontend: Use browser dev tools, Angular DevTools recommended
- Test database: Delete `portfolio.db` to reset all data