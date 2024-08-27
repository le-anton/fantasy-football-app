import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ThemeService {
  private activeTheme: 'light-mode' | 'dark-mode' = 'light-mode';

  constructor() {
    if (typeof window !== 'undefined' && window.localStorage) {
      this.activeTheme = window.matchMedia('(prefers-color-scheme: dark)')
        .matches
        ? 'dark-mode'
        : 'light-mode';
      this.setTheme(this.activeTheme);
    }
  }

  setTheme(theme: 'light-mode' | 'dark-mode') {
    this.activeTheme = theme;
    document.body.setAttribute(
      'data-theme',
      this.activeTheme === 'light-mode' ? 'dark-mode' : 'light-mode'
    );
  }

  toggleTheme() {
    if (this.activeTheme === 'light-mode') {
      this.setTheme('dark-mode');
    } else {
      this.setTheme('light-mode');
    }
  }

  get currentTheme() {
    return this.activeTheme;
  }
}
