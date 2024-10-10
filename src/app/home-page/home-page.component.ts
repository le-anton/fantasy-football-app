import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { CurrentTeamComponent } from '../current-team/current-team.component';
import { FantasyApiRestServiceService } from '../services/fantasy-api-rest-service.service';
import { PlayerDisplay, SummaryData, TeamData } from '../utils/model';
import { TeamTemplateComponent } from '../team-template/team-template.component';
import { Captaincy, Positions, TeamViewMode } from '../utils/enum';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home-page',
  standalone: true,
  imports: [CommonModule, CurrentTeamComponent, TeamTemplateComponent],
  templateUrl: './home-page.component.html',
  styleUrl: './home-page.component.less',
})
export class HomePageComponent implements OnInit {
  tempViewMode: TeamViewMode = TeamViewMode.EDIT;
  gameSummary: SummaryData = {
    events: [],
    game_settings: null,
    phases: [],
    teams: [],
    total_players: 0,
    elements: [],
    element_stats: [],
    elements_types: [],
  };
  currentPointsTotal: number = 0;
  currentTeam: PlayerDisplay[] = [];

  currentTeamValue: number = 0;

  constructor(
    private fantasyRestService: FantasyApiRestServiceService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.fetchCurrentPointsTotal();
    // this.fetchApiData();
    this.loadTeamData();
  }

  fetchApiData() {
    this.fantasyRestService.getSummaryData().subscribe({
      next: (response: SummaryData) => {
        this.gameSummary = response;
        // console.log(response);
      },
      error: (error) => {
        console.error('Error fetching data:', error);
      },
    });
  }

  fetchCurrentPointsTotal(): void {
    this.currentPointsTotal = 0;
  }

  loadTeamData() {
    this.currentTeam = [
      {
        id: 12,
        name: 'Marcus Rashford',
        team: {
          id: 4,
          name: 'Manchester United',
          short_code: 'MUN',
        },
        next_fixture: 'Chelsea',
        captaincy: null,
        sub: null,
        price: 5.0,
        roundPoints: 12,
        totalPoints: 100,
        toSwap: false,
        toTransfer: false,
        position: Positions.FWD,
      },
      {
        id: 1,
        name: 'Harry Kane',
        team: {
          id: 1,
          name: 'Tottenham Hotspur',
          short_code: 'TOT',
        },
        next_fixture: 'Arsenal',
        captaincy: Captaincy.C,
        sub: null,
        price: 5.0,
        roundPoints: 4,
        totalPoints: 100,
        toSwap: false,
        toTransfer: false,
        position: Positions.FWD,
      },
      {
        id: 8,
        name: 'Raheem Sterling',
        team: {
          id: 5,
          name: 'Chelsea',
          short_code: 'CHE',
        },
        next_fixture: 'Manchester United',
        captaincy: null,
        sub: { subPriority: 1 },
        price: 5.0,
        roundPoints: 7,
        totalPoints: 100,
        toSwap: false,
        toTransfer: false,
        position: Positions.FWD,
      },
      {
        id: 2,
        name: 'Kevin De Bruyne',
        team: {
          id: 2,
          name: 'Manchester City',
          short_code: 'MCI',
        },
        next_fixture: 'Liverpool',
        captaincy: Captaincy.VC,
        sub: null,
        price: 6.0,
        roundPoints: 40,
        totalPoints: 100,
        toSwap: false,
        toTransfer: false,
        position: Positions.MID,
      },
      {
        id: 3,
        name: 'Mohamed Salah',
        team: {
          id: 3,
          name: 'Liverpool',
          short_code: 'LIV',
        },
        next_fixture: 'Manchester City',
        captaincy: null,
        sub: null,
        price: 10.0,
        roundPoints: 2,
        totalPoints: 100,
        toSwap: false,
        toTransfer: false,
        position: Positions.MID,
      },
      {
        id: 4,
        name: 'Bruno Fernandes',
        team: {
          id: 4,
          name: 'Manchester United',
          short_code: 'MUN',
        },
        next_fixture: 'Chelsea',
        captaincy: null,
        sub: null,
        price: 14.0,
        roundPoints: 7,
        totalPoints: 100,
        toSwap: false,
        toTransfer: false,
        position: Positions.MID,
      },
      {
        id: 7,
        name: 'Mason Mount',
        team: {
          id: 5,
          name: 'Chelsea',
          short_code: 'CHE',
        },
        next_fixture: 'Manchester United',
        captaincy: null,
        sub: { subPriority: 3 },
        price: 7.0,
        roundPoints: 21,
        totalPoints: 100,
        toSwap: false,
        toTransfer: false,
        position: Positions.MID,
      },
      {
        id: 5,
        name: 'Son Heung-min',
        team: {
          id: 1,
          name: 'Tottenham Hotspur',
          short_code: 'TOT',
        },
        next_fixture: 'Arsenal',
        captaincy: null,
        sub: null,
        price: 10.0,
        roundPoints: 4,
        totalPoints: 100,
        toSwap: false,
        toTransfer: false,
        position: Positions.MID,
      },
      {
        id: 9,
        name: 'Declan Rice',
        team: {
          id: 6,
          name: 'West Ham United',
          short_code: 'WHU',
        },
        next_fixture: 'Everton',
        captaincy: null,
        sub: null,
        price: 7.0,
        roundPoints: 9,
        totalPoints: 100,
        toSwap: false,
        toTransfer: false,
        position: Positions.MID,
      },
      {
        id: 13,
        name: 'Kieran Tierney',
        team: {
          id: 7,
          name: 'Arsenal',
          short_code: 'ARS',
        },
        next_fixture: 'Tottenham Hotspur',
        captaincy: null,
        sub: null,
        price: 4.0,
        roundPoints: 5,
        totalPoints: 100,
        toSwap: false,
        toTransfer: false,
        position: Positions.DEF,
      },
      {
        id: 6,
        name: 'Virgil van Dijk',
        team: {
          id: 3,
          name: 'Liverpool',
          short_code: 'LIV',
        },
        next_fixture: 'Manchester City',
        captaincy: null,
        sub: null,
        price: 6.5,
        roundPoints: 2,
        totalPoints: 100,
        toSwap: false,
        toTransfer: false,
        position: Positions.DEF,
      },
      {
        id: 10,
        name: 'Ruben Dias',
        team: {
          id: 2,
          name: 'Manchester City',
          short_code: 'MCI',
        },
        next_fixture: 'Liverpool',
        captaincy: null,
        sub: null,
        price: 5.5,
        roundPoints: 7,
        totalPoints: 100,
        toSwap: false,
        toTransfer: false,
        position: Positions.DEF,
      },
      {
        id: 14,
        name: 'Edouard Mendy',
        team: {
          id: 5,
          name: 'Chelsea',
          short_code: 'CHE',
        },
        next_fixture: 'Manchester United',
        captaincy: null,
        sub: null,
        price: 4.5,
        roundPoints: 2,
        totalPoints: 100,
        toSwap: false,
        toTransfer: false,
        position: Positions.GK,
      },
      {
        id: 11,
        name: 'Aaron Ramsdale',
        team: {
          id: 7,
          name: 'Arsenal',
          short_code: 'ARS',
        },
        next_fixture: 'Tottenham Hotspur',
        captaincy: null,
        sub: { subPriority: 0 },
        price: 4.5,
        roundPoints: 7,
        totalPoints: 100,
        toSwap: false,
        toTransfer: false,
        position: Positions.GK,
      },
    ];
    this.currentPointsTotal = this.currentTeam
      .filter((player) => !player.sub)
      .reduce((acc, val) => acc + (val.roundPoints || 0), 0);
    this.currentTeamValue = this.currentTeam.reduce(
      (acc, val) => acc + (val.price || 0),
      0
    );
  }

  getCaptainPoints(): number {
    //TODO: use this to manifest captaincy points later on
    const allGwPlayers: PlayerDisplay[] = Object.values(
      this.currentTeam
    ).flat();
    const captain: PlayerDisplay | undefined = allGwPlayers.find(
      (player: PlayerDisplay) => player.captaincy === Captaincy.C
    );
    const viceCaptain: PlayerDisplay | undefined = allGwPlayers.find(
      (player: PlayerDisplay) => player.captaincy === Captaincy.VC
    );
    if (captain && captain.roundPoints !== 0) {
      //TODO: ascertain what result of non-playing captain looks like in DTO
      return captain.roundPoints;
    } else if (viceCaptain) {
      return viceCaptain.roundPoints;
    } else {
      this.router.navigate(['/error']);
    }
    return 0;
  }

  get viewMode(): typeof TeamViewMode {
    return TeamViewMode;
  }
}
