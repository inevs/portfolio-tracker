import { Routes } from '@angular/router';
import { PortfolioListComponent } from './portfolio/portfolio-list/portfolio-list.component';
import { PortfolioDetailComponent } from './portfolio/portfolio-detail/portfolio-detail.component';

export const routes: Routes = [
  { path: '', redirectTo: '/portfolios', pathMatch: 'full' },
  { path: 'portfolios', component: PortfolioListComponent },
  { path: 'portfolios/:id', component: PortfolioDetailComponent },
  { path: '**', redirectTo: '/portfolios' }
];
