class Period {
  first: number;
  second: number;
}

class Venue {
  id: number;
  name: string;
  city: string;
}

class Status {
  long: string;
  short: string;
  elapsed: number;
}

class League {
  id: string;
  name: string;
  country: string;
  logo: string;
  flag?: string | null;
  season: number;
  round: string;
}

class Team {
  id: number;
  name: string;
  logo: string;
  winner: boolean;
}

class Teams {
  home: Team;
  away: Team;
}

class Goals {
  home?: number | null;
  away?: number | null;
}

class ScoreResult {
  home?: number | null;
  away?: number | null;
}

class Score {
  halftime: ScoreResult;
  fulltime: ScoreResult;
  extratime: ScoreResult;
  penalty: ScoreResult;
}

export class Match {
  id?: string;
  referee?: string | null;
  timezone: string;
  date: string;
  timestamp: number;
  periods: Period;
  venue: Venue;
  status: Status;
  league: League;
  teams: Teams;
  goals: Goals;
  score: Score;
  createdAt: Date;
  updatedAt: Date;

  constructor(props: Partial<Match>) {
    Object.assign(this, props);
  }
}
