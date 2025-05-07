import { Component } from '@angular/core';
import { ThemeService } from '../services/theme.service';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.less',
})
export class HeaderComponent {
  constructor(public themeService: ThemeService, private router: Router) {}

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
