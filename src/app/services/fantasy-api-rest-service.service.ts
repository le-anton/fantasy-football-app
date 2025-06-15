import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Player, SummaryData, PlayerSummary, Fixture } from '../utils/model';

@Injectable({
  providedIn: 'root',
})
export class FantasyApiRestService {
  constructor(private httpClient: HttpClient) { }

  getSummaryData(): Observable<SummaryData> {
    return this.httpClient.get<SummaryData>('/api/bootstrap-static/');
  }

  getFixtures(): Observable<Fixture[]> {
    return this.httpClient.get<Fixture[]>('/api/fixtures/');
  }

  getPlayerSummary(playerId: string): Observable<PlayerSummary> {
    return this.httpClient.get<any>('/api/element-summary/' + playerId + '/');
  }
}
