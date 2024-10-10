import { Component } from '@angular/core';
import { ThemeService } from '../services/theme.service';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.less',
})
export class HeaderComponent {
  constructor(private themeService: ThemeService, private router: Router) {}

  get currentTheme() {
    return this.themeService.currentTheme;
  }

  changeTheme() {
    this.themeService.toggleTheme();
  }

  navigateToHome() {
    this.router.navigate(['/home']);
  }
}
