import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { SummaryData } from '../utils/model';

@Injectable({
  providedIn: 'root',
})
export class FantasyApiRestServiceService {
  constructor(private httpClient: HttpClient) {}

  getSummaryData(): Observable<SummaryData> {
    return this.httpClient.get<SummaryData>(
      'https://fantasy.premierleague.com/api/bootstrap-static/'
    );
  }

  getFixtures(): Observable<any> {
    return this.httpClient.get<any>(
      'https://fantasy.premierleague.com/api/fixtures/'
    );
  }
}
