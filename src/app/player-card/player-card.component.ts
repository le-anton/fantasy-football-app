import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Captaincy, Positions, TeamViewMode } from '../utils/enum';
import { PlayerDisplay, TeamData } from '../utils/model';
import { CommonModule } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { ViewPlayerInfoComponent } from '../view-player-info/view-player-info.component';

@Component({
  selector: 'app-player-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './player-card.component.html',
  styleUrl: './player-card.component.less',
})
export class PlayerCardComponent {
  @Input() viewMode: TeamViewMode = TeamViewMode.CURRENT;
  @Input() swapPlayerMode: boolean = false;
  @Input() player: PlayerDisplay = {
    id: 0,
    name: '',
    captaincy: null,
    team: {
      id: 0,
      name: '',
    },
    sub: null,
    price: 0,
    totalPoints: 0,
    roundPoints: 0,
    next_fixture: '',
    toSwap: false,
    toTransfer: false,
    position: Positions.GK,
  };
  @Input() captaincyChangeMode: boolean = false;
  @Output() playerChange = new EventEmitter<PlayerDisplay>();
  @Output() captaincyChange = new EventEmitter<PlayerDisplay>();

  constructor(public dialog: MatDialog) {}

  openPlayerInfoModal() {
    this.dialog.open(ViewPlayerInfoComponent, {
      height: '40vh',
      width: '60vw',
      data: this.player,
      panelClass: 'custom-dialog-container',
    });
  }

  swapPlayer() {
    this.player.toSwap = !this.player.toSwap;
    this.playerChange.emit(this.player);
  }

  changeCaptaincy() {
    this.captaincyChange.emit(this.player);
  }

  get teamViewMode(): typeof TeamViewMode {
    return TeamViewMode;
  }

  get captaincy(): typeof Captaincy {
    return Captaincy;
  }
}
