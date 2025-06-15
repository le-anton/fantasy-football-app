import { Component, Inject, OnInit, ViewChild, ElementRef, AfterViewInit, OnDestroy } from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';
import { PlayerDisplay, PlayerSummary, Team } from '../utils/model';
import { FantasyApiRestService } from '../services/fantasy-api-rest-service.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { LoadingSpinnerComponent } from '../loading-spinner/loading-spinner.component';
import { CommonModule } from '@angular/common';
import { ConfigService } from '../services/config.service';
import { MatTabsModule } from '@angular/material/tabs';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-view-player-info',
  standalone: true,
  imports: [
    MatDialogModule,
    LoadingSpinnerComponent,
    CommonModule,
    MatTabsModule,
    MatTableModule,
    MatIconModule,
    MatButtonModule,
    MatExpansionModule,
    MatCardModule,
  ],
  templateUrl: './view-player-info.component.html',
  styleUrl: './view-player-info.component.less',
})
export class ViewPlayerInfoComponent implements OnInit, AfterViewInit, OnDestroy {
  playerSummary: PlayerSummary = {
    fixtures: [],
    history: [],
    history_past: [],
  };
  loading: boolean = false;
  teams: Team[] = [];
  futureDisplayedColumns: string[] = ['gameweek', 'opposition', 'difficulty'];
  pastDisplayedColumns: string[] = [
    'gameweek',
    'opposition',
    'result',
    'gw_points',
  ];
  @ViewChild('scrollableArea') scrollableAreaRef!: ElementRef<HTMLDivElement>;
  public showScrollFade = false;
  private scrollListener!: () => void;

  constructor(
    public dialogRef: MatDialogRef<ViewPlayerInfoComponent>,
    private fantasyRestService: FantasyApiRestService,
    private toastr: ToastrService,
    private router: Router,
    private configService: ConfigService,
    @Inject(MAT_DIALOG_DATA) public player: PlayerDisplay
  ) { }

  ngOnInit(): void {
    this.loadInitialData();
  }

  ngAfterViewInit(): void {
    if (this.scrollableAreaRef) {
      setTimeout(() => this.checkScroll(), 0);

      this.scrollListener = this.onScroll.bind(this);
      this.scrollableAreaRef.nativeElement.addEventListener('scroll', this.scrollListener);
    }
  }

  ngOnDestroy(): void {
    if (this.scrollableAreaRef && this.scrollListener) {
      this.scrollableAreaRef.nativeElement.removeEventListener('scroll', this.scrollListener);
    }
  }

  loadInitialData() {
    this.loading = true;
    this.teams = this.configService.getTeams();

    this.fantasyRestService
      .getPlayerSummary(this.player.id.toString())
      .subscribe({
        next: (data) => {
          this.playerSummary = data;
          this.playerSummary.history.reverse();
        },
        error: () => {
          this.toastr.error('Error fetching player summary.');
        },
        complete: () => {
          this.loading = false;
          setTimeout(() => this.checkScroll(), 0);
        },
      });
  }

  onScroll(): void {
    this.checkScroll();
  }

  private checkScroll(): void {
    if (this.scrollableAreaRef) {
      const el = this.scrollableAreaRef.nativeElement;
      const threshold = 5;

      this.showScrollFade = el.scrollHeight - el.scrollTop - el.clientHeight > threshold;
    } else {
      this.showScrollFade = false;
    }
  }

  getOpponentTeamName(teamA: number, teamH: number, isHome: boolean): string {
    return isHome
      ? this.getTeamName(teamA) + ' (H)'
      : this.getTeamName(teamH) + ' (A)';
  }

  getResult(teamHScore: number | null, teamAScore: number | null): string {
    if (teamHScore === null || teamAScore === null) {
      return 'TBD';
    }
    return `${teamHScore} - ${teamAScore}`;
  }

  getTeamName(id: number): string {
    return this.teams.find((team) => team.id === id)?.short_name || '';
  }

  displayTeamName(id: number, isHome: boolean) {
    return this.getTeamName(id) + (isHome ? ' (H)' : ' (A)');
  }

  closeDialog() {
    this.dialogRef.close();
  }
}
