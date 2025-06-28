import { Component, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { LayoutService } from '../services/layout.service';

@Component({
  selector: 'app-topbar',
  standalone: true,
  imports: [CommonModule, ButtonModule, RouterLink],
  template: `
    <div class="layout-topbar">
      <div class="layout-topbar-content">
        <div class="layout-topbar-logo">
          <svg width="35" height="35" viewBox="0 0 35 35" fill="none" xmlns="http://www.w3.org/2000/svg" class="h-2rem">
            <path fill-rule="evenodd" clip-rule="evenodd" d="M15.9999 2C16.9999 2 17.9999 2.59995 18.5999 3.39995L22.8 9.19995C23.2 9.79995 23.4 10.5 23.4 11.2V21.8C23.4 22.5 23.2 23.2 22.8 23.8L18.5999 29.6C17.9999 30.4 16.9999 31 15.9999 31C14.9999 31 13.9999 30.4 13.3999 29.6L9.19995 23.8C8.79995 23.2 8.59995 22.5 8.59995 21.8V11.2C8.59995 10.5 8.79995 9.79995 9.19995 9.19995L13.3999 3.39995C13.9999 2.59995 14.9999 2 15.9999 2ZM15.9999 27C16.5999 27 17.1999 26.7 17.5999 26.2L20.6 21.6C20.8 21.3 20.9999 20.9 20.9999 20.5V12.5C20.9999 12.1 20.8 11.7 20.6 11.4L17.5999 6.79995C17.1999 6.29995 16.5999 6 15.9999 6C15.3999 6 14.7999 6.29995 14.3999 6.79995L11.3999 11.4C11.1999 11.7 10.9999 12.1 10.9999 12.5V20.5C10.9999 20.9 11.1999 21.3 11.3999 21.6L14.3999 26.2C14.7999 26.7 15.3999 27 15.9999 27Z" [attr.fill]="logoFill()"/>
          </svg>
          <span class="layout-topbar-title">Portfolio Tracker</span>
        </div>
        
        <div class="layout-topbar-actions">
          <p-button 
            [icon]="themeIcon()" 
            [text]="true" 
            [rounded]="true"
            severity="secondary"
            (onClick)="toggleDarkMode()">
          </p-button>
          <p-button 
            icon="pi pi-th-large" 
            [text]="true" 
            [rounded]="true"
            severity="secondary"
            routerLink="/portfolios">
          </p-button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .layout-topbar {
      background-color: var(--p-surface-card);
      border-bottom: 1px solid var(--p-surface-border);
      padding: 1rem 2rem;
      position: sticky;
      top: 0;
      z-index: 1000;
    }

    .layout-topbar-content {
      display: flex;
      align-items: center;
      justify-content: space-between;
      max-width: 1200px;
      margin: 0 auto;
    }

    .layout-topbar-logo {
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }

    .layout-topbar-title {
      font-size: 1.25rem;
      font-weight: 600;
      color: var(--p-text-color);
    }

    .layout-topbar-actions {
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }

    .h-2rem {
      height: 2rem;
    }

    @media (max-width: 768px) {
      .layout-topbar {
        padding: 1rem;
      }
      
      .layout-topbar-title {
        font-size: 1rem;
      }
    }
  `]
})
export class AppTopbarComponent {
  private layoutService = inject(LayoutService);

  isDarkMode = computed(() => this.layoutService.isDarkMode());
  
  themeIcon = computed(() => 
    this.isDarkMode() ? 'pi pi-sun' : 'pi pi-moon'
  );

  logoFill = computed(() => 
    this.isDarkMode() ? '#ffffff' : '#1976d2'
  );

  toggleDarkMode() {
    this.layoutService.toggleDarkMode();
  }
}