import { Positions } from './enum';
import { Fixture, Player, PlayerDisplay, PlayerPosition, Team } from './model';

export function convertPlayerToCustomFormat(
  player: Player,
  teams: Team[],
  subPosition: number,
  positions: PlayerPosition[]
): PlayerDisplay {
  const team = teams.find((team) => team.id === player.team);
  return {
    id: player.id,
    name: `${player.first_name} ${player.second_name}`,
    captaincy: null,
    roundPoints: player.event_points,
    totalPoints: player.total_points,
    team: teamToDisplayType(team),
    sub: { subPriority: subPosition },
    position: positions.find((pos) => pos.id === player.element_type)
      ?.singular_name_short as Positions,
    price: player.now_cost / 10,
    toSwap: false,
    toTransfer: false,
  };
}

function teamToDisplayType(team: Team | undefined) {
  return {
    id: team?.id || 0,
    name: team?.name || '',
    short_code: team?.short_name || '',
  };
}
