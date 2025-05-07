import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { forkJoin } from 'rxjs';
import { LoadingSpinnerComponent } from '../loading-spinner/loading-spinner.component';
import { ConfigService } from '../services/config.service';
import { FantasyApiRestService } from '../services/fantasy-api-rest-service.service';
import { TeamDataService } from '../services/team-data.service';
import { TeamTemplateComponent } from '../team-template/team-template.component';
import { TeamViewMode } from '../utils/enum';
import { PlayerDisplay } from '../utils/model';
import { EditNameComponent } from '../edit-name/edit-name.component';

@Component({
  selector: 'app-edit-team',
  standalone: true,
  imports: [
    TeamTemplateComponent,
    LoadingSpinnerComponent,
    CommonModule,
    EditNameComponent,
  ],
  templateUrl: './edit-team.component.html',
  styleUrl: './edit-team.component.less',
})
export class EditTeamComponent implements OnInit {
  currentTeam: PlayerDisplay[] = [];
  currentGW: number = 1;
  pointsHistory: number[] = [];
  currentPointsTotal: number = 0;
  budget: number = 0;

  loading: boolean = false;

  constructor(
    private fantasyRestService: FantasyApiRestService,
    private router: Router,
    private configService: ConfigService,
    private toastr: ToastrService,
    private teamDataService: TeamDataService
  ) {}

  ngOnInit(): void {
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
