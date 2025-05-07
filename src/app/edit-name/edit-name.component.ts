import { Component, Input, OnInit } from '@angular/core';
import { LocalStorageService } from '../services/local-storage.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-edit-name',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './edit-name.component.html',
  styleUrl: './edit-name.component.less',
})
export class EditNameComponent implements OnInit {
  @Input() currentGW: number = 1;
  teamName: string = 'Your Team';
  editNameMode: boolean = false;

  constructor(
    private localStorage: LocalStorageService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.teamName = this.localStorage.getItem('fplTeamName') || 'Your Team';
  }

  toggleEditMode(): void {
    if (this.editNameMode) {
      this.localStorage.setItem('fplTeamName', this.teamName);
      this.toastr.success('Team name saved!');
    }
    this.editNameMode = !this.editNameMode;
  }

  closeEditMode(): void {
    this.editNameMode = !this.editNameMode;
  }
}
