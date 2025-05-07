import { Injectable } from '@angular/core';
import { PlayerDisplay } from '../utils/model';

@Injectable({
  providedIn: 'root',
})
export class SaveService {
  private freePlayers: number = 0;
  private transferTeam: PlayerDisplay[] = [];

  getCanSave(): boolean {
    return this.freePlayers === 0;
  }

  addFreePlayer(): void {
    this.freePlayers += 1;
  }

  fillFreePlayer(): void {
    this.freePlayers -= 1;
  }

  getCandidateTeam() {
    return this.transferTeam;
  }

  setCandidateTeam(transferTeam: PlayerDisplay[]) {
    this.transferTeam = transferTeam;
  }

  setFreePlayers(freePlayers: number) {
    this.freePlayers = freePlayers;
  }
}
