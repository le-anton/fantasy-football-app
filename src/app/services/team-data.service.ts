// team-data.service.ts
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class TeamDataService {
  private _teamData: any;

  set teamData(data: any) {
    this._teamData = data;
  }

  get teamData() {
    return this._teamData;
  }
}
