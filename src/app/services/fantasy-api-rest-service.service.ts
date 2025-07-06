import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Player, SummaryData, PlayerSummary, Fixture } from '../utils/model';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class FantasyApiRestService {
  private apiUrl = environment.apiUrl;

  private httpOptions = {
    headers: new HttpHeaders({
      'Accept-Encoding': 'identity',
      'Content-Type': 'application/json'
    })
  };

  constructor(private httpClient: HttpClient) { }

  getSummaryData(): Observable<SummaryData> {
    return this.httpClient.get<SummaryData>(`${this.apiUrl}/bootstrap-static/`, this.httpOptions);
  }

  getFixtures(): Observable<Fixture[]> {
    return this.httpClient.get<Fixture[]>(`${this.apiUrl}/fixtures/`, this.httpOptions);
  }

  getPlayerSummary(playerId: string): Observable<PlayerSummary> {
    return this.httpClient.get<any>(`${this.apiUrl}/element-summary/${playerId}/`, this.httpOptions);
  }
}
