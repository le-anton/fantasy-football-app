import { Injectable } from '@angular/core';
import {
  Fixture,
  Player,
  PlayerPosition,
  PlayerStats,
  SummaryData,
  Team,
} from '../utils/model';

@Injectable({
  providedIn: 'root',
})
export class ConfigService {
  private players: Player[] = [];
  private teams: Team[] = [];
  private stats: PlayerStats[] = [];
  private positions: PlayerPosition[] = [];
  private currentWeek: number = 1;
  private fixtures: Fixture[] = [];

  setConfig(summary: SummaryData) {
    this.setPlayers(summary.elements);
    this.setStats(summary.element_stats);
    this.setTeams(summary.teams);
    this.setPositions(summary.element_types);
    summary.events.forEach((element) => {
      if (element.finished === true) this.currentWeek = element.id;
    });
  }

  setFixtures(fixtures: Fixture[]) {
    this.fixtures = fixtures;
  }

  setPlayers(players: Player[]): void {
    this.players = players;
  }

  setTeams(teams: Team[]): void {
    this.teams = teams;
  }

  setStats(stats: PlayerStats[]): void {
    this.stats = stats;
  }

  setPositions(positions: PlayerPosition[]) {
    this.positions = positions;
  }

  getPositions(): PlayerPosition[] {
    return this.positions;
  }

  getPlayers(): Player[] {
    return this.players;
  }

  getTeams(): Team[] {
    return this.teams;
  }

  getStats(): PlayerStats[] {
    return this.stats;
  }

  getNextFixtures(): Fixture[] {
    return this.currentWeek !== 38
      ? this.fixtures.filter(
          (fixture) => fixture.event === this.currentWeek + 1
        )
      : [];
  }
}
