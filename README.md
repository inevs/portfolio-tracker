# Securities Portfolio Tracker

A full-stack web application for tracking securities portfolios with real-time data and analytics.

## Tech Stack

- **Frontend**: Angular with TypeScript
- **Backend**: NestJS with TypeScript
- **Database**: SQLite (development) / PostgreSQL (production)
- **Styling**: Angular Material

## Project Structure

- `frontend/` - Angular application
- `backend/` - NestJS API server
- `shared/` - Shared TypeScript types and utilities

## Development

### Prerequisites

- Node.js 18+
- npm

### Getting Started

1. Install dependencies:
   ```bash
   npm install
   cd frontend && npm install
   cd ../backend && npm install
   ```

2. Start development servers:
   ```bash
   npm run dev
   ```

   This will start both the NestJS backend (port 3000) and Angular frontend (port 4200).

### Individual Commands

- Frontend development: `npm run dev:frontend`
- Backend development: `npm run dev:backend`
- Build all: `npm run build`
- Test all: `npm run test`

## Features

- Portfolio management (add/remove securities)
- Real-time stock price tracking
- Performance analytics and charts
- Data export/import
- Responsive design