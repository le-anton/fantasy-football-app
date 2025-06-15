import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { Captaincy, Positions, TeamViewMode } from '../utils/enum';
import { Player, PlayerDisplay, TeamData } from '../utils/model';
import { CommonModule } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { ViewPlayerInfoComponent } from '../view-player-info/view-player-info.component';
import { TransferPlayerModalComponent } from '../transfer-player-modal/transfer-player-modal.component';
import { defaultPlayer } from '../utils/default-player';
import { convertPlayerToCustomFormat } from '../utils/player-display-mapper';
import { ConfigService } from '../services/config.service';
import { SaveService } from '../services/save.service';

@Component({
  selector: 'app-player-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './player-card.component.html',
  styleUrl: './player-card.component.less',
})
export class PlayerCardComponent implements OnInit, OnChanges {
  @Input() viewMode: TeamViewMode = TeamViewMode.CURRENT;
  @Input() swapPlayerMode: boolean = false;
  @Input() player: PlayerDisplay = defaultPlayer;
  @Input() captaincyChangeMode: boolean = false;
  @Input() isCurrentCaptain: boolean = false;
  @Output() playerChange = new EventEmitter<PlayerDisplay>();
  @Output() captaincyChange = new EventEmitter<PlayerDisplay>();

  transferCandidate: Player | null = null;
  playerToDisplay: PlayerDisplay = this.player;
  selectPlayerMode: boolean = false;
  nextFixture: string = 'N/A';

  constructor(
    public dialog: MatDialog,
    private config: ConfigService,
    private saveService: SaveService
  ) { }

  ngOnInit(): void {
    this.playerToDisplay = this.player;
    this.displayNextFixture();
    if (this.player.id === -1) {
      this.transferCandidate = null;
      this.selectPlayerMode = true;
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['player'] && changes['player'].currentValue) {
      this.playerToDisplay = changes['player'].currentValue;
      if (this.player.id === -1) {
        this.transferCandidate = null;
        this.selectPlayerMode = true;
      } else {
        this.selectPlayerMode = false;
      }
    }
  }

  openPlayerInfoModal() {
    this.dialog.open(ViewPlayerInfoComponent, {
      data: this.player,
    });
  }

  swapPlayer() {
    this.player.toSwap = !this.player.toSwap;
    this.playerChange.emit(this.player);
  }

  transferPlayer() {
    if (!this.selectPlayerMode) {
      this.freeUpPlayer();
      this.playerChange.emit(this.player);
    } else {
      this.dialog
        .open(TransferPlayerModalComponent, {
          data: this.player,
        })
        .afterClosed()
        .subscribe((result) => {
          switch (result) {
            case 'reset':
              this.selectPlayerMode = false;
              this.player.toTransfer = false;
              this.transferCandidate = null;
              this.playerToDisplay = this.player;
              this.saveService.fillFreePlayer();
              this.playerChange.emit(this.player);
              break;
            default:
              if (result) {
                this.transferCandidate = result as Player;
                this.playerToDisplay = convertPlayerToCustomFormat(
                  result,
                  this.config.getTeams(),
                  this.player.sub?.subPriority || 0,
                  this.config.getPositions()
                ) as PlayerDisplay;
                this.selectPlayerMode = false;
                this.saveService.fillFreePlayer();
                this.playerChange.emit(this.playerToDisplay);
              }
          }
        });
    }
  }

  freeUpPlayer() {
    this.transferCandidate = null;
    this.selectPlayerMode = true;
    this.player.toTransfer = true;
    this.playerToDisplay = { ...this.player, toTransfer: true };
    this.saveService.addFreePlayer();
  }

  restorePlayer() {
    this.player.toTransfer = false;
    this.saveService.fillFreePlayer();
    this.playerChange.emit(this.player);
  }

  changeCaptaincy() {
    if (this.viewMode !== TeamViewMode.CURRENT) {
      this.captaincyChange.emit(this.player);
    }
  }

  displayCaptaincy(captaincy: Captaincy): string {
    switch (captaincy) {
      case Captaincy.C:
        return 'C';
      case Captaincy.VC:
        return 'VC';
      default:
        return '*';
    }
  }

  displayNextFixture() {
    const nextGame = this.config
      .getNextFixtures()
      .find(
        (fixt) =>
          fixt.team_a === this.player.team?.id ||
          fixt.team_h === this.player.team?.id
      );
    const isTeamA = nextGame?.team_a === this.player.team.id;
    const nextOpponent = this.config
      .getTeams()
      .find(
        (team) => team.id === (isTeamA ? nextGame.team_h : nextGame?.team_a)
      )?.short_name;
    this.nextFixture = nextOpponent
      ? nextOpponent + (isTeamA ? '(A)' : '(H)')
      : 'N/A';
  }

  get roundPoints() {
    return this.isCurrentCaptain
      ? 2 * this.playerToDisplay.roundPoints
      : this.playerToDisplay.roundPoints;
  }

  get teamViewMode(): typeof TeamViewMode {
    return TeamViewMode;
  }

  get captaincy(): typeof Captaincy {
    return Captaincy;
  }
}
