export interface Match {
  id: number;
  referee?: string | null;
  timezone: string;
  date: string;
  timestamp: number;
  periods: {
    first: number;
    second: number;
  };
  venue: {
    id: number;
    name: string;
    city: string;
  };
  status: {
    long: string;
    short: string;
    elapsed: number;
  };
  league: League;
  teams: {
    home: Team;
    away: Team;
  };
  goals: Goals;
  score: Score;
}

export interface League {
  id: number;
  name: string;
  country: string;
  logo: string;
  flag?: string | null;
  season: number;
  round: string;
}

export interface Team {
  id: number;
  name: string;
  logo: string;
  winner: boolean;
}

export interface ScoreResult {
  home?: number | null;
  away?: number | null;
}

export interface Score {
  halftime: ScoreResult;
  fulltime: ScoreResult;
  extratime: ScoreResult;
  penalty: ScoreResult;
}

export interface Goals {
  home?: number | null;
  away?: number | null;
}
