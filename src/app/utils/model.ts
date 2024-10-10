import { Captaincy, Positions } from './enum';

export interface SummaryData {
  events: Event[];
  game_settings: GameSettings | null;
  phases: Phase[];
  teams: Team[];
  total_players: number;
  elements: Player[];
  element_stats: ElementStats[];
  elements_types: PlayerPosition[];
}

export interface ElementStats {
  label: string;
  name: string;
}

export interface PlayerPosition {
  id: number;
  plural_name: string;
  plural_name_short: string;
  singular_name: string;
  singular_name_short: string;
  squad_select: number;
  squad_min_select: null;
  squad_max_select: null;
  squad_min_play: number;
  squad_max_play: number;
  ui_shirt_specific: boolean;
  sub_positions_locked: number[];
  element_count: number;
}

export interface Player {
  chance_of_playing_next_round: number | null;
  chance_of_playing_this_round: number | null;
  code: number;
  cost_change_event: number;
  cost_change_event_fall: number;
  cost_change_start: number;
  cost_change_start_fall: number;
  dreamteam_count: number;
  element_type: number;
  ep_next: string;
  ep_this: string;
  event_points: number;
  first_name: string;
  form: string;
  id: number;
  in_dreamteam: boolean;
  news: string;
  news_added: Date | null;
  now_cost: number;
  photo: string;
  points_per_game: string;
  second_name: string;
  selected_by_percent: string;
  special: boolean;
  squad_number: null;
  status: Status;
  team: number;
  team_code: number;
  total_points: number;
  transfers_in: number;
  transfers_in_event: number;
  transfers_out: number;
  transfers_out_event: number;
  value_form: string;
  value_season: string;
  web_name: string;
  minutes: number;
  goals_scored: number;
  assists: number;
  clean_sheets: number;
  goals_conceded: number;
  own_goals: number;
  penalties_saved: number;
  penalties_missed: number;
  yellow_cards: number;
  red_cards: number;
  saves: number;
  bonus: number;
  bps: number;
  influence: string;
  creativity: string;
  threat: string;
  ict_index: string;
  starts: number;
  expected_goals: string;
  expected_assists: string;
  expected_goal_involvements: string;
  expected_goals_conceded: string;
  influence_rank: number;
  influence_rank_type: number;
  creativity_rank: number;
  creativity_rank_type: number;
  threat_rank: number;
  threat_rank_type: number;
  ict_index_rank: number;
  ict_index_rank_type: number;
  corners_and_indirect_freekicks_order: number | null;
  corners_and_indirect_freekicks_text: string;
  direct_freekicks_order: number | null;
  direct_freekicks_text: string;
  penalties_order: number | null;
  penalties_text: string;
  expected_goals_per_90: number;
  saves_per_90: number;
  expected_assists_per_90: number;
  expected_goal_involvements_per_90: number;
  expected_goals_conceded_per_90: number;
  goals_conceded_per_90: number;
  now_cost_rank: number;
  now_cost_rank_type: number;
  form_rank: number;
  form_rank_type: number;
  points_per_game_rank: number;
  points_per_game_rank_type: number;
  selected_rank: number;
  selected_rank_type: number;
  starts_per_90: number;
  clean_sheets_per_90: number;
}

export enum Status {
  A = 'a',
  D = 'd',
  I = 'i',
  S = 's',
  U = 'u',
}

export interface Event {
  id: number;
  name: string;
  deadline_time: Date;
  release_time: null;
  average_entry_score: number;
  finished: boolean;
  data_checked: boolean;
  highest_scoring_entry: number | null;
  deadline_time_epoch: number;
  deadline_time_game_offset: number;
  highest_score: number | null;
  is_previous: boolean;
  is_current: boolean;
  is_next: boolean;
  cup_leagues_created: boolean;
  h2h_ko_matches_created: boolean;
  ranked_count: number;
  chip_plays: ChipPlay[];
  most_selected: number | null;
  most_transferred_in: number | null;
  top_element: number | null;
  top_element_info: TopElementInfo | null;
  transfers_made: number;
  most_captained: number | null;
  most_vice_captained: number | null;
}

export interface ChipPlay {
  chip_name: string;
  num_played: number;
}

export interface TopElementInfo {
  id: number;
  points: number;
}

export interface GameSettings {
  league_join_private_max: number;
  league_join_public_max: number;
  league_max_size_public_classic: number;
  league_max_size_public_h2h: number;
  league_max_size_private_h2h: number;
  league_max_ko_rounds_private_h2h: number;
  league_prefix_public: string;
  league_points_h2h_win: number;
  league_points_h2h_lose: number;
  league_points_h2h_draw: number;
  league_ko_first_instead_of_random: boolean;
  cup_start_event_id: null;
  cup_stop_event_id: null;
  cup_qualifying_method: null;
  cup_type: null;
  featured_entries: any[];
  percentile_ranks: number[];
  squad_squadplay: number;
  squad_squadsize: number;
  squad_team_limit: number;
  squad_total_spend: number;
  ui_currency_multiplier: number;
  ui_use_special_shirts: boolean;
  ui_special_shirt_exclusions: any[];
  stats_form_days: number;
  sys_vice_captain_enabled: boolean;
  transfers_cap: number;
  transfers_sell_on_fee: number;
  max_extra_free_transfers: number;
  league_h2h_tiebreak_stats: string[];
  timezone: string;
}

export interface Phase {
  id: number;
  name: string;
  start_event: number;
  stop_event: number;
  highest_score: number | null;
}

export interface Team {
  code: number;
  draw: number;
  form: null;
  id: number;
  loss: number;
  name: string;
  played: number;
  points: number;
  position: number;
  short_name: string;
  strength: number;
  team_division: null;
  unavailable: boolean;
  win: number;
  strength_overall_home: number;
  strength_overall_away: number;
  strength_attack_home: number;
  strength_attack_away: number;
  strength_defence_home: number;
  strength_defence_away: number;
  pulse_id: number;
}

export interface Fixtures {
  code: number;
  event: number;
  finished: boolean;
  finished_provisional: boolean;
  id: number;
  kickoff_time: Date;
  minutes: number;
  provisional_start_time: boolean;
  started: boolean;
  team_a: number;
  team_a_score: number | null;
  team_h: number;
  team_h_score: number | null;
  stats: Stat[];
  team_h_difficulty: number;
  team_a_difficulty: number;
  pulse_id: number;
}

export interface Stat {
  identifier: Identifier;
  a: A[];
  h: A[];
}

export interface A {
  value: number;
  element: number;
}

export enum Identifier {
  Assists = 'assists',
  Bonus = 'bonus',
  Bps = 'bps',
  GoalsScored = 'goals_scored',
  OwnGoals = 'own_goals',
  PenaltiesMissed = 'penalties_missed',
  PenaltiesSaved = 'penalties_saved',
  RedCards = 'red_cards',
  Saves = 'saves',
  YellowCards = 'yellow_cards',
}

export interface PlayerDisplay {
  id: number;
  name: string;
  captaincy: Captaincy | null;
  roundPoints: number;
  totalPoints: number;
  team: DisplayType;
  next_fixture: string;
  sub: SubDetails | null;
  position: Positions;
  price: number;
  toSwap: boolean;
  toTransfer: boolean;
}

export interface SubDetails {
  subPriority: number;
}

export interface DisplayType {
  id: number;
  name: string;
  short_code?: string;
}

export interface TeamData {
  gk: PlayerDisplay[];
  def: PlayerDisplay[];
  mid: PlayerDisplay[];
  fwd: PlayerDisplay[];
}

export interface PositionLimits {
  gk: Limit;
  def: Limit;
  mid: Limit;
  fwd: Limit;
  subs: Limit;
}

export interface Limit {
  min: number;
  max: number;
}
