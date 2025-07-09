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
  ) { }

  ngOnInit() {
    this.transferTeam = JSON.parse(JSON.stringify(this.team));

    this.transferTeam.forEach((player, index) => {
      const originalPlayer = this.team[index];
      player.toTransfer = player.id !== originalPlayer.id && player.id !== -1 && player.id !== 0;
    });

    this.getCurrentCaptain();
    const emptySlots = this.transferTeam.filter(player => player.id === -1 || player.id === 0).length;
    this.saveService.setFreePlayers(emptySlots);
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
    newPlayer: PlayerDisplay,
    originalPlayerInSlot: PlayerDisplay
  ) {
    if (!newPlayer) {
      return;
    }

    let slotIndex = -1;

    for (let i = 0; i < this.transferTeam.length; i++) {
      const currentPlayer = this.transferTeam[i];
      if (currentPlayer.id === originalPlayerInSlot.id &&
        currentPlayer.position === originalPlayerInSlot.position) {
        const subMatch = (currentPlayer.sub === null && originalPlayerInSlot.sub === null) ||
          (currentPlayer.sub && originalPlayerInSlot.sub &&
            currentPlayer.sub.subPriority === originalPlayerInSlot.sub.subPriority);
        if (subMatch) {
          slotIndex = i;
          break;
        }
      }
    }

    if (slotIndex === -1) {
      for (let i = 0; i < this.transferTeam.length; i++) {
        const currentPlayer = this.transferTeam[i];
        if (currentPlayer.position === originalPlayerInSlot.position) {
          const subMatch = (currentPlayer.sub === null && originalPlayerInSlot.sub === null) ||
            (currentPlayer.sub && originalPlayerInSlot.sub &&
              currentPlayer.sub.subPriority === originalPlayerInSlot.sub.subPriority);

          if (subMatch && (currentPlayer.id === -1 || currentPlayer.id === 0)) {
            slotIndex = i;
            break;
          }
        }
      }
    }

    if (slotIndex === -1) {
      this.toastr.error('Error updating player: Slot not found.');
      return;
    }

    const currentPlayerInSlot = this.transferTeam[slotIndex];
    this.updatePlayerAtIndex(newPlayer, currentPlayerInSlot, slotIndex);
  }

  private updatePlayerAtIndex(newPlayer: PlayerDisplay, originalPlayer: PlayerDisplay, index: number) {
    if (!newPlayer || !newPlayer.hasOwnProperty('id')) {
      return;
    }

    newPlayer.sub = originalPlayer.sub;
    newPlayer.captaincy = originalPlayer.captaincy;

    if (newPlayer.id === -1 || newPlayer.id === 0) {
      newPlayer.captaincy = null;
      newPlayer.toTransfer = false;
    } else {
      newPlayer.toTransfer = true;
    }

    this.transferTeam[index] = newPlayer;

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
    if (this.viewMode !== TeamViewMode.EDIT) {
      this.canSave = true;
      return;
    }

    const saveServiceCanSave = this.saveService.getCanSave();
    const fundsAvailable = this.fundsAvailable;
    const teamQuotaNotExceeded = this.teamQuotaNotExceeded;
    const hasTeamChanges = this.hasTeamChanges;

    this.canSave = saveServiceCanSave && fundsAvailable && teamQuotaNotExceeded && hasTeamChanges;
  }

  get fundsAvailable(): boolean {
    return this.budget >= Math.round(this.totalValue() * 2) / 2;
  }

  get teamQuotaNotExceeded(): boolean {
    const teamCount: Record<number, number> = {};
    this.transferTeam
      .filter(player => player.id !== -1 && player.id !== 0 && player.team.id !== 0)
      .forEach(
        (player) =>
        (teamCount[player.team.id] = teamCount[player.team.id]
          ? teamCount[player.team.id] + 1
          : 1)
      );
    return Object.values(teamCount).every((val) => val <= 3);
  }

  get hasTeamChanges(): boolean {
    return this.transferTeam.some((transferPlayer, index) => {
      const originalPlayer = this.team[index];
      return transferPlayer.id !== originalPlayer.id;
    });
  }

  totalValue() {
    return this.transferTeam.reduce((total, val) => total + val.price, 0);
  }

  saveTeam() {
    if (!this.canSave) {
      const errorMsg: string[] = [];

      if (!this.saveService.getCanSave() && this.editMode) {
        const hasUnfilledNonTransferSlots = this.transferTeam.some(player =>
          (player.id === -1 || player.id === 0) && !player.toTransfer
        );

        if (hasUnfilledNonTransferSlots) {
          errorMsg.push('Players not filled');
        }
      }

      if (!this.fundsAvailable && this.editMode)
        errorMsg.push('Funds not available');
      if (!this.teamQuotaNotExceeded && this.editMode)
        errorMsg.push('Too many players from one team');
      if (errorMsg.length === 0 && !this.canSave)
        errorMsg.push('Changes invalid or not found.');

      if (errorMsg.length > 0) {
        this.toastr.error(errorMsg.join(', '));
      }
      return;
    }

    if (this.tentativeMode) {
      this.localStorageService.setItem(
        'fplTeam',
        JSON.stringify({
          team: this.team,
          budget: this.budget,
          points: [],
          lastUpdated: new Date(),
        })
      );
      this.toastr.success('Saved');
      this.canSave = false;
      return;
    }

    const saveData: LocalData = {
      team: this.transferTeam,
      budget: this.budget,
      points: [],
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
    const teamToShow = this.editMode ? this.transferTeam : this.team;
    return Object.values(teamToShow).filter(
      (player) => !player.sub && player.position === position
    );
  }

  get getSubPlayers(): PlayerDisplay[] {
    const teamToShow = this.editMode ? this.transferTeam : this.team;
    return Object.values(teamToShow).filter((player) => player.sub !== null);
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
