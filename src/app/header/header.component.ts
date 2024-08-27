import { Component } from '@angular/core';
import { ThemeService } from '../services/theme.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.less',
})
export class HeaderComponent {
  constructor(private themeService: ThemeService) {}

  get currentTheme() {
    return this.themeService.currentTheme;
  }

  changeTheme() {
    this.themeService.toggleTheme();
  }
}
