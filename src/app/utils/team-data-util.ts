import { LocalStorageService } from '../services/local-storage.service';
import { defaultEleven } from '../utils/default-player';
import { LocalData, PlayerDisplay } from '../utils/model';

export function fetchTeamData(localStorageService: LocalStorageService): any {
  const teamData = localStorageService.getItem('fplTeam');

  if (teamData) {
    const parsedData = JSON.parse(teamData) as LocalData;
    const currentTeam = parsedData.team;
    const pointsHistory = parsedData.points || [];
    const currentPointsTotal = pointsHistory.reduce(
      (total, val) => total + val,
      0
    );
    const budget = parsedData.budget;

    const { currentWeekPoints, currentTeamValue } =
      calculateTeamStats(currentTeam);

    return {
      currentTeam,
      pointsHistory,
      currentPointsTotal,
      budget,
      currentWeekPoints,
      currentTeamValue,
    };
  } else {
    return handleNoTeamData();
  }
}

function calculateTeamStats(currentTeam: PlayerDisplay[]): {
  currentWeekPoints: number;
  currentTeamValue: number;
} {
  const currentWeekPoints = currentTeam
    .filter((player) => !player.sub)
    .reduce((acc, val) => acc + (val.roundPoints || 0), 0);

  const currentTeamValue = currentTeam.reduce(
    (acc, val) => acc + (val.price || 0),
    0
  );

  return { currentWeekPoints, currentTeamValue };
}

function handleNoTeamData(): any {
  return {
    currentTeam: defaultEleven,
    pointsHistory: [],
    currentPointsTotal: 0,
    budget: 100,
    currentWeekPoints: 0,
    currentTeamValue: defaultEleven.reduce(
      (acc, player) => acc + (player.price || 0),
      0
    ),
  };
}
