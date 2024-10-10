import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { PlayerCardComponent } from '../player-card/player-card.component';
import { Captaincy, Positions, TeamViewMode } from '../utils/enum';
import {
  PlayerDisplay,
  PlayerPosition,
  PositionLimits,
  TeamData,
} from '../utils/model';
import { ToastrModule, ToastrService } from 'ngx-toastr';

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

  canSave: boolean = false;
  toSwap: PlayerDisplay | null = null;
  toSwapCaptaincy: PlayerDisplay | null = null;

  constructor(private toastr: ToastrService) {}

  ngOnInit() {}

  checkValidEdit(): void {}

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
  }

  transferPlayerChange(player?: PlayerDisplay) {}

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
}

export const positionMinimums: PositionLimits = {
  gk: {
    min: 1,
    max: 1,
  },
  def: {
    min: 3,
    max: 5,
  },
  mid: {
    min: 3,
    max: 5,
  },
  fwd: {
    min: 1,
    max: 3,
  },
  subs: {
    min: 4,
    max: 4,
  },
};
