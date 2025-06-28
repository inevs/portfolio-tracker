import { Injectable, signal, effect, inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class LayoutService {
  private document = inject(DOCUMENT);
  private _isDarkMode = signal(this.getInitialTheme());

  isDarkMode = this._isDarkMode.asReadonly();

  constructor() {
    effect(() => {
      this.updateDocumentClass();
    });
  }

  private getInitialTheme(): boolean {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('darkMode');
      if (saved !== null) {
        return JSON.parse(saved);
      }
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return false;
  }

  toggleDarkMode(): void {
    const newValue = !this._isDarkMode();
    this._isDarkMode.set(newValue);
    if (typeof window !== 'undefined') {
      localStorage.setItem('darkMode', JSON.stringify(newValue));
    }
  }

  private updateDocumentClass(): void {
    const html = (this.document as Document).documentElement;
    if (this._isDarkMode()) {
      html.classList.add('p-dark');
    } else {
      html.classList.remove('p-dark');
    }
  }
}