import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { CurrentTeamComponent } from '../current-team/current-team.component';

@Component({
  selector: 'app-home-page',
  standalone: true,
  imports: [CommonModule, CurrentTeamComponent],
  templateUrl: './home-page.component.html',
  styleUrl: './home-page.component.less',
})
export class HomePageComponent implements OnInit {
  currentPointsTotal: number = 0;

  ngOnInit(): void {
    this.fetchCurrentPointsTotal();
  }

  fetchCurrentPointsTotal(): void {
    this.currentPointsTotal = 0;
  }
}
