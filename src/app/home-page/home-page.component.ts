import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { forkJoin } from 'rxjs';
import { EditNameComponent } from '../edit-name/edit-name.component';
import { LoadingSpinnerComponent } from '../loading-spinner/loading-spinner.component';
import { ConfigService } from '../services/config.service';
import { FantasyApiRestService } from '../services/fantasy-api-rest-service.service';
import { TeamDataService } from '../services/team-data.service';
import { TeamTemplateComponent } from '../team-template/team-template.component';
import { TeamViewMode } from '../utils/enum';
import { PlayerDisplay, SummaryData } from '../utils/model';

@Component({
  selector: 'app-home-page',
  standalone: true,
  imports: [
    CommonModule,
    TeamTemplateComponent,
    LoadingSpinnerComponent,
    EditNameComponent,
  ],
  templateUrl: './home-page.component.html',
  styleUrl: './home-page.component.less',
})
export class HomePageComponent implements OnInit {
  gameSummary: SummaryData = {
    events: [],
    game_settings: null,
    phases: [],
    teams: [],
    total_players: 0,
    elements: [],
    element_stats: [],
    element_types: [],
  };
  pointsHistory: number[] = [];
  currentPointsTotal: number = 0;
  currentTeam: PlayerDisplay[] = [];
  currentWeekPoints: number = 0;
  currentGW: number = 1;

  budget: number = 0;
  currentTeamValue: number = 0;
  loading: boolean = false;

  constructor(
    private fantasyRestService: FantasyApiRestService,
    private router: Router,
    private configService: ConfigService,
    private toastr: ToastrService,
    private teamDataService: TeamDataService
  ) {}

  ngOnInit(): void {
    //TODO: Edit Team name
    this.fetchApiData();
    Object.assign(this, this.teamDataService.teamData);
    if (this.currentTeam.find((player) => player.id === -1)) {
      this.router.navigate(['/transfer']);
    }
  }

  fetchApiData() {
    this.loading = true;
    forkJoin({
      summary: this.fantasyRestService.getSummaryData(),
      fixtures: this.fantasyRestService.getFixtures(),
    }).subscribe({
      next: (data) => {
        this.configService.setConfig(data.summary);
        this.configService.setFixtures(data.fixtures);
        this.currentGW =
          data.summary.events.find((gw) => gw.is_current)?.id || 1;
      },
      error: () => {
        this.toastr.error('Error fetching config.');
        this.router.navigate(['/error']);
      },
      complete: () => {
        this.loading = false;
      },
    });
  }

  get viewMode(): typeof TeamViewMode {
    return TeamViewMode;
  }
}
