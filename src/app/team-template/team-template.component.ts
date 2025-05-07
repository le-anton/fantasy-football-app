import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { PlayerCardComponent } from '../player-card/player-card.component';
import { LocalStorageService } from '../services/local-storage.service';
import { SaveService } from '../services/save.service';
import { Captaincy, Positions, TeamViewMode } from '../utils/enum';
import { LocalData, PlayerDisplay, PositionLimits } from '../utils/model';
import { Router } from '@angular/router';
import { fetchTeamData } from '../utils/team-data-util';
import { TeamDataService } from '../services/team-data.service';

@Component({
  selector: 'app-team-template',
  standalone: true,
  imports: [PlayerCardComponent, CommonModule],
  templateUrl: './team-template.component.html',
  styleUrl: './team-template.component.less',
})
export class TeamTemplateComponent implements OnInit {
  @Input() viewMode: TeamViewMode = TeamViewMode.CURRENT;
  @Input() team: PlayerDisplay[] = [];
  @Input() budget: number = 0;

  canSave: boolean = false;
  toSwap: PlayerDisplay | null = null;
  toSwapCaptaincy: PlayerDisplay | null = null;
  transferTeam: PlayerDisplay[] = [];
  currentCaptain: PlayerDisplay | null = null;

  constructor(
    private toastr: ToastrService,
    private saveService: SaveService,
    private router: Router,
    private localStorageService: LocalStorageService,
    private teamDataService: TeamDataService
  ) {}

  ngOnInit() {
    this.transferTeam = JSON.parse(JSON.stringify(this.team));
    this.getCurrentCaptain();
  }

  get swapPlayerMode(): boolean {
    return this.toSwap != null;
  }

  swapPlayerChange(player: PlayerDisplay) {
    if (this.toSwap === player) {
      this.cancelSwapMode();
    } else if (!this.swapPlayerMode) {
      this.toSwap = player || null;
    } else {
      const playersToSwap = [player, this.toSwap];
      let activePlayer = playersToSwap.find((candidate) => !candidate?.sub);
      let benchedPlayer = playersToSwap.find((candidate) => candidate?.sub);

      if (
        activePlayer &&
        benchedPlayer &&
        this.canSwapPlayers(activePlayer, benchedPlayer)
      ) {
        this.swapPlayers(activePlayer, benchedPlayer);
      } else {
        this.toastr.error("Can't swap players!");
      }
      this.cancelSwapMode();
      player.toSwap = false;
    }
  }

  cancelSwapMode() {
    if (this.toSwap) {
      this.toSwap.toSwap = false;
    }
    this.toSwap = null;
  }

  swapPlayers(activePlayer: PlayerDisplay, benchedPlayer: PlayerDisplay) {
    [activePlayer.sub, benchedPlayer.sub] = [
      benchedPlayer.sub,
      activePlayer.sub,
    ];
    if (activePlayer.captaincy) {
      benchedPlayer.captaincy = activePlayer.captaincy;
      activePlayer.captaincy = null;
    }
    this.checkCanSave();
  }

  transferPlayerChange(
    player: PlayerDisplay | undefined,
    original: PlayerDisplay
  ) {
    if (this.transferTeam.filter((val) => val.id === player?.id).length > 1) {
      this.toastr.error('Player already in team');
    }
    const idx = this.team.findIndex(
      (val) => val.id === original.id && val.position === original.position
    );
    if (!player) {
      this.transferTeam[idx].price = 0;
    } else if (player.id !== original.id) {
      player.sub = original.sub;
      player.captaincy = original.captaincy;
      player.toTransfer = true;
      this.transferTeam[idx] = player;
    } else {
      original.price = this.team[idx].price;
      this.transferTeam[idx] = original;
    }
    this.saveService.setCandidateTeam(this.transferTeam);
    this.checkCanSave();
  }

  canSwapPlayers(
    activePlayer: PlayerDisplay,
    benchedPlayer: PlayerDisplay
  ): boolean {
    const samePosition: boolean =
      activePlayer.position === benchedPlayer.position;
    const swapWithinRange: boolean =
      this.getActivePlayersByPosition(activePlayer.position).length >
        positionMinimums[activePlayer.position].min &&
      this.getActivePlayersByPosition(benchedPlayer.position).length <
        positionMinimums[benchedPlayer.position].max;

    return swapWithinRange || samePosition;
  }

  changeCaptaincy(player: PlayerDisplay) {
    if (this.toSwapCaptaincy === player) {
      this.cancelSwapMode();
      return;
    } else if (!this.toSwapCaptaincy) {
      this.toSwapCaptaincy = player;
    } else if (
      player &&
      this.toSwapCaptaincy &&
      this.canChangeCaptaincy(player)
    ) {
      [player.captaincy, this.toSwapCaptaincy.captaincy] = [
        this.toSwapCaptaincy.captaincy,
        player.captaincy,
      ];
      this.toSwapCaptaincy = null;
      this.checkCanSave();
    } else {
      this.toastr.error("Can't swap captaincy!");
    }
  }

  canChangeCaptaincy(player: PlayerDisplay) {
    return (
      player.captaincy !== this.toSwapCaptaincy?.captaincy &&
      player.sub === null
    );
  }

  checkCanSave() {
    this.canSave =
      this.viewMode === TeamViewMode.EDIT
        ? this.saveService.getCanSave() &&
          this.fundsAvailable &&
          this.noDuplicates &&
          this.teamQuotaNotExceeded
        : true;
  }

  get fundsAvailable(): boolean {
    return this.budget >= Math.round(this.totalValue() * 2) / 2;
  }

  get noDuplicates(): boolean {
    return (
      new Set(this.transferTeam.map((player) => player.id)).size ===
      this.transferTeam.length
    );
  }

  get teamQuotaNotExceeded(): boolean {
    const teamCount: Record<number, number> = {};
    this.transferTeam.forEach(
      (player) =>
        (teamCount[player.team.id] = teamCount[player.team.id]
          ? teamCount[player.team.id] + 1
          : 1)
    );
    return Object.values(teamCount).every((val) => val <= 3);
  }

  totalValue() {
    return this.transferTeam.reduce((total, val) => total + val.price, 0);
  }

  saveTeam() {
    if (!this.canSave) {
      const errorMsg: string[] = [];
      if (!this.saveService.getCanSave() && this.editMode)
        errorMsg.push('Players not filled');
      if (!this.fundsAvailable && this.editMode)
        errorMsg.push('Funds not available');
      if (!this.teamQuotaNotExceeded && this.editMode)
        errorMsg.push('Too many players from one team');
      if (errorMsg.length === 0) errorMsg.push('Changes invalid or not found.');
      this.toastr.error(errorMsg.join(', '));
      return;
    }
    if (this.tentativeMode) {
      this.localStorageService.setItem(
        'fplTeam',
        JSON.stringify({
          team: this.team,
          budget: this.budget,
          points: [], //TODO: add points history
          lastUpdated: new Date(),
        })
      );
      this.toastr.success('Saved');
      this.canSave = false;
      return;
    }
    //TODO: log and effect hit price
    const saveData: LocalData = {
      team: this.transferTeam,
      budget: this.budget,
      points: [], //TODO: add points history
      lastUpdated: new Date(),
    };
    saveData.team.forEach((player) => {
      player.toTransfer = false;
      player.toSwap = false;
    });
    this.localStorageService.setItem('fplTeam', JSON.stringify(saveData));
    this.teamDataService.teamData = fetchTeamData(this.localStorageService);
    this.router.navigate(['']);
  }

  private getCurrentCaptain(): void {
    const allGwPlayers: PlayerDisplay[] = Object.values(
      this.transferTeam
    ).flat();
    const captain: PlayerDisplay | undefined = allGwPlayers.find(
      (player: PlayerDisplay) => player.captaincy === Captaincy.C
    );
    const viceCaptain: PlayerDisplay | undefined = allGwPlayers.find(
      (player: PlayerDisplay) => player.captaincy === Captaincy.VC
    );
    if (captain && captain.roundPoints !== 0) {
      this.currentCaptain = captain;
    } else if (viceCaptain && viceCaptain.roundPoints !== 0) {
      this.currentCaptain = viceCaptain;
    } else {
      this.currentCaptain = null;
    }
  }

  get editMode(): boolean {
    return this.viewMode === TeamViewMode.EDIT;
  }

  get currentMode(): boolean {
    return this.viewMode === TeamViewMode.CURRENT;
  }

  get tentativeMode(): boolean {
    return this.viewMode === TeamViewMode.TENTATIVE;
  }

  get playerPosition(): typeof Positions {
    return Positions;
  }

  getActivePlayersByPosition(position: Positions) {
    return Object.values(this.team).filter(
      (player) => !player.sub && player.position === position
    );
  }

  get getSubPlayers(): PlayerDisplay[] {
    return Object.values(this.team).filter((player) => player.sub !== null);
  }

  get gameweekPoints(): number {
    return (
      this.team
        .filter((player) => player.sub === null)
        .reduce((acc, val) => acc + val.roundPoints, 0) +
      (this.currentCaptain?.roundPoints || 0)
    );
  }
}

export const positionMinimums: PositionLimits = {
  GKP: {
    min: 1,
    max: 1,
  },
  DEF: {
    min: 3,
    max: 5,
  },
  MID: {
    min: 3,
    max: 5,
  },
  FWD: {
    min: 1,
    max: 3,
  },
  SUBS: {
    min: 4,
    max: 4,
  },
};
