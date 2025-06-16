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
  apiError: string | null = null;

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
    if (this.teamDataService.hasTeamData()) {
      Object.assign(this, this.teamDataService.teamData);
    } else {
      this.toastr.error('Initial team data not found. Please try refreshing.');
    }

    this.fetchApiData();

    if (this.currentTeam && this.currentTeam.length > 0 && this.currentTeam.find((player) => player.id === -1)) {
      this.router.navigate(['/transfer']);
    } else if (!this.currentTeam || this.currentTeam.length === 0 && this.teamDataService.hasTeamData()) {
      const resolvedData = this.teamDataService.teamData;
      if (resolvedData && resolvedData.currentTeam && resolvedData.currentTeam.find((player: PlayerDisplay) => player.id === -1)) {
        this.router.navigate(['/transfer']);
      }
    }
  }

  fetchApiData() {
    this.loading = true;
    this.apiError = null;
    forkJoin({
      summary: this.fantasyRestService.getSummaryData(),
      fixtures: this.fantasyRestService.getFixtures(),
    }).subscribe({
      next: (data) => {
        this.configService.setConfig(data.summary);
        this.configService.setFixtures(data.fixtures);
        this.currentGW =
          data.summary.events.find((gw) => gw.is_current)?.id || this.currentGW || 1;

        if (this.teamDataService.hasTeamData() && (!this.currentTeam || this.currentTeam.length === 0)) {
            Object.assign(this, this.teamDataService.teamData);
            if (this.currentTeam && this.currentTeam.length > 0 && this.currentTeam.find((player) => player.id === -1)) {
                this.router.navigate(['/transfer']);
            }
        }
        this.loading = false;
      },
      error: (err) => {
        console.error('Error fetching API data in HomePageComponent:', err);
        this.toastr.error('Could not refresh live data. Displaying cached information if available.', 'API Error');
        this.apiError = 'Failed to load live data. Please try again later.';
        if (!this.configService.getTeams() || this.configService.getTeams().length === 0) {
          this.toastr.error('Essential configuration missing. Navigating to error page.', 'Critical Error');
          this.router.navigate(['/error']);
        }
        this.loading = false;
      }
    });
  }

  get viewMode(): typeof TeamViewMode {
    return TeamViewMode;
  }
}
