import { Injectable } from '@angular/core';
import { Resolve, Router } from '@angular/router';
import { catchError, Observable, of } from 'rxjs';
import { fetchTeamData } from '../utils/team-data-util';
import { LocalStorageService } from './local-storage.service';

@Injectable({
  providedIn: 'root',
})
export class TeamResolver implements Resolve<any> {
  currentTeam: any[] = [];
  pointsHistory: number[] = [];
  currentPointsTotal = 0;
  budget = 100;
  currentWeekPoints = 0;
  currentTeamValue = 0;

  constructor(
    private localStorageService: LocalStorageService,
    private router: Router
  ) { }

  resolve(): Observable<any> {
    const teamData = fetchTeamData(this.localStorageService);

    return of(teamData).pipe(
      catchError((error) => {
        console.error('Error resolving team data', error);
        this.router.navigate(['/error']);
        return of(null);
      })
    );
  }
}
