import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterOutlet } from '@angular/router';
import { HeaderComponent } from '../header/header.component';
import { TeamData } from '../utils/model';
import { TeamDataService } from '../services/team-data.service';

@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [RouterOutlet, HeaderComponent],
  templateUrl: './main-layout.component.html',
  styleUrl: './main-layout.component.less',
})
export class MainLayoutComponent implements OnInit {
  teamData: any;

  constructor(
    private route: ActivatedRoute,
    private teamDataService: TeamDataService
  ) {}

  ngOnInit(): void {
    this.route.data.subscribe((data) => {
      this.teamDataService.teamData = data['teamData'];
    });
  }
}
