import { CommonModule } from '@angular/common';
import { Component, Inject, ViewChild, AfterViewInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { ConfigService } from '../services/config.service';
import { Player, PlayerDisplay, PlayerStats } from '../utils/model';
import { SaveService } from '../services/save.service';
import { defaultPlayer } from '../utils/default-player';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-transfer-player-modal',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatSortModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule
  ],
  templateUrl: './transfer-player-modal.component.html',
  styleUrl: './transfer-player-modal.component.less',
})
export class TransferPlayerModalComponent implements AfterViewInit {
  staticPlayerList: Player[] = [];
  dataSource = new MatTableDataSource<Player>([]);
  playerToAdd: Player | null = null;
  positionId: number = 0;
  stats: PlayerStats[] = [];
  canRestorePlayer: boolean = false;
  displayedColumns: string[] = [];

  private desiredStatLabels: string[] = [
    'Minutes played',
    'Goals scored',
    'Assists',
    'Clean sheets',
    'Goals conceded',
    'Yellow cards',
    'Red cards',
    'Bonus',
    'Bonus Points System',
    'Influence',
    'Creativity',
    'Threat',
    'ICT Index'
  ];

  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    public dialogRef: MatDialogRef<TransferPlayerModalComponent>,
    private configService: ConfigService,
    private saveService: SaveService,
    @Inject(MAT_DIALOG_DATA) public player: PlayerDisplay
  ) { }

  ngOnInit(): void {
    this.positionId =
      this.configService
        .getPositions()
        .find((pos) => pos.singular_name_short === this.player.position)?.id ||
      0;
    this.fetchPlayers();
    const allStats = this.configService.getStats();

    this.stats = allStats.filter(stat => this.desiredStatLabels.includes(stat.label));
    this.canRestorePlayer = this.player.id !== defaultPlayer.id && this.player.id !== -1;
    this.displayedColumns = ['playerName', 'now_cost', ...this.stats.map(stat => stat.name)];
  }

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
    this.dataSource.sortingDataAccessor = (item, property) => {
      switch (property) {
        case 'playerName': return item.first_name + ' ' + item.second_name;
        case 'now_cost': return item.now_cost;
        default:
          const value = item[property as keyof Player];
          return typeof value === 'number' ? value : (value || '').toString().toLowerCase();
      }
    };

    this.sort.active = 'now_cost';
    this.sort.direction = 'desc';
    this.dataSource.sort = this.sort;
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  selectPlayer(player: Player) {
    this.dialogRef.close(player);
  }

  restorePlayer() {
    this.dialogRef.close('reset');
  }

  fetchPlayers(): void {
    if (this.player.position) {
      const candidateTeamIds = this.saveService
        .getCandidateTeam()
        .map((p) => p.id);
      this.staticPlayerList = this.configService
        .getPlayers()
        .filter(
          (p) =>
            p.element_type == this.positionId &&
            p.id !== this.player.id &&
            !candidateTeamIds.includes(p.id)
        );
      this.dataSource.data = this.staticPlayerList;

      if (this.sort) {
        this.sort.active = 'now_cost';
        this.sort.direction = 'desc';
        this.dataSource.sort = this.sort;
      }
    }
  }

  addTransferCandidate() {
    this.dialogRef.close(this.playerToAdd);
  }

  closeModal(): void {
    this.dialogRef.close(null);
  }
}
