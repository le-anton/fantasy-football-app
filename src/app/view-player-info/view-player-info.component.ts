import { Component, Inject } from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';
import { PlayerDisplay } from '../utils/model';

@Component({
  selector: 'app-view-player-info',
  standalone: true,
  imports: [MatDialogModule],
  templateUrl: './view-player-info.component.html',
  styleUrl: './view-player-info.component.less',
})
export class ViewPlayerInfoComponent {
  constructor(
    public dialogRef: MatDialogRef<ViewPlayerInfoComponent>,
    @Inject(MAT_DIALOG_DATA) public player: PlayerDisplay
  ) {}

  closeDialog() {
    this.dialogRef.close('Pizza!');
  }
}
