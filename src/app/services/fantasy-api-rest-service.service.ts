import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Player, SummaryData, PlayerSummary, Fixture } from '../utils/model';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class FantasyApiRestService {
  private apiUrl = environment.apiUrl;

  constructor(private httpClient: HttpClient) { }

  getSummaryData(): Observable<SummaryData> {
    return this.httpClient.get<SummaryData>(`${this.apiUrl}/bootstrap-static/`);
  }

  getFixtures(): Observable<Fixture[]> {
    return this.httpClient.get<Fixture[]>(`${this.apiUrl}/fixtures/`);
  }

  getPlayerSummary(playerId: string): Observable<PlayerSummary> {
    return this.httpClient.get<any>(`${this.apiUrl}/element-summary/${playerId}/`);
  }
}
