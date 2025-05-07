import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { LoadingSpinnerComponent } from '../loading-spinner/loading-spinner.component';
import { ConfigService } from '../services/config.service';
import { Player, PlayerDisplay, PlayerStats } from '../utils/model';
import { SaveService } from '../services/save.service';

@Component({
  selector: 'app-transfer-player-modal',
  standalone: true,
  imports: [CommonModule, LoadingSpinnerComponent],
  templateUrl: './transfer-player-modal.component.html',
  styleUrl: './transfer-player-modal.component.less',
})
export class TransferPlayerModalComponent {
  staticPlayerList: Player[] = [];
  playerList: any[] = [];
  playerToAdd: Player | null = null;
  positionId: number = 0;
  stats: PlayerStats[] = [];
  propertySortDesc: string = 'now_cost';

  constructor(
    public dialogRef: MatDialogRef<TransferPlayerModalComponent>,
    private configService: ConfigService,
    private saveService: SaveService,
    @Inject(MAT_DIALOG_DATA) public player: PlayerDisplay
  ) {}

  ngOnInit(): void {
    this.positionId =
      this.configService
        .getPositions()
        .find((pos) => pos.singular_name_short === this.player.position)?.id ||
      0;
    this.fetchPlayers();
    this.stats = this.configService.getStats();
  }

  sortBy(property: string) {
    this.playerList = this.staticPlayerList;
    this.playerList.sort((a, b) => b[property] - a[property]);
    if (this.propertySortDesc === property) {
      this.propertySortDesc = '';
      this.playerList.reverse();
    } else {
      this.propertySortDesc = property;
    }
  }

  selectPlayer(player: Player) {
    this.dialogRef.close(player);
  }

  restorePlayer() {
    this.dialogRef.close('reset');
  }

  fetchPlayers(): void {
    if (this.player.position) {
      this.staticPlayerList = this.configService
        .getPlayers()
        .filter(
          (player) =>
            player.element_type == this.positionId &&
            player.id !== this.player.id &&
            !this.saveService
              .getCandidateTeam()
              .find((val) => val.id === player.id)
        )
        .sort((a, b) => b.now_cost - a.now_cost);
      this.playerList = this.staticPlayerList;
    }
  }

  addTransferCandidate() {
    this.dialogRef.close(this.playerToAdd);
  }

  closeModal(): void {
    this.dialogRef.close(null);
  }
}
