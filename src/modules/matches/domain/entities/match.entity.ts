import { MatchShortStatusEnum, MatchTypeEnum } from '../enums';
import { getMatchTypeByStatus } from '../mappers';
import { MatchEvent } from './match-event.entity';

const isNullOrType = (value: any, type: string) =>
  value === null || typeof value === type;

class MatchStatusVO {
  long: string;
  short: MatchShortStatusEnum;
  elapsed: number;
  type: MatchTypeEnum;
  extra: number | null;

  constructor(
    long: string,
    short: MatchShortStatusEnum,
    elapsed: number,
    extra: number | null,
  ) {
    this.long = long;
    this.short = short;
    this.elapsed = elapsed;
    this.extra = extra;

    if (
      !isNullOrType(long, 'string') ||
      !isNullOrType(short, 'string') ||
      !isNullOrType(elapsed, 'number')
    ) {
      throw new Error(
        'Invalid status properties long, short or elapsed are required',
      );
    }

    const type = getMatchTypeByStatus(short);

    if (!type) {
      throw new Error(`Invalid status: ${short}`);
    }

    this.type = type;
  }
}

class Period {
  first: number | null;
  second: number | null;
}

export class Venue {
  id?: string | null;
  name: string;
  city: string;
}

class Status {
  long: string;
  short: MatchShortStatusEnum;
  elapsed: number;
  type: MatchTypeEnum;
  extra: number | null;
}

export class MatchLeague {
  id: string;
  name: string;
  country: string;
  logo: string;
  flag?: string | null;
  season: number;
  round: string;
}

class Team {
  id: string;
  name: string;
  logo: string;
  winner: boolean;
}

class Teams {
  home: Team;
  away: Team;
}

class Goals {
  home: number | null;
  away: number | null;
}

class ScoreResult {
  home: number | null;
  away: number | null;
}

class Score {
  halftime: ScoreResult;
  fulltime: ScoreResult;
  extratime: ScoreResult;
  penalty: ScoreResult;
}

export interface MatchDto {
  id: string;
  referee?: string | null;
  timezone: string;
  date: string;
  timestamp: number;
  periods: Period;
  venue: Venue;
  status: MatchStatusVO;
  league: MatchLeague;
  teams: Teams;
  goals: Goals;
  score: Score;
  events: MatchEvent[];
  createdAt: Date;
  updatedAt: Date;
}

export class Match {
  id: string;
  referee: string | null;
  timezone: string;
  date: string;
  timestamp: number;
  periods: Period;
  venue: Venue;
  status: Status;
  league: MatchLeague;
  teams: Teams;
  goals: Goals;
  score: Score;
  events: MatchEvent[] = [];
  createdAt: Date;
  updatedAt: Date;

  constructor(props: MatchDto) {
    const currentDate = new Date();

    const { status } = props;

    const statusVO: MatchStatusVO = new MatchStatusVO(
      status.long,
      status.short,
      status.elapsed,
      status.extra,
    );

    this.events = props.events?.map((event) => new MatchEvent(event)) || [];

    if (props.referee) {
      this.referee = props.referee || null;
    }

    Object.assign(this, {
      ...props,
      status: statusVO,
      events: props.events?.map((event) => new MatchEvent(event)),
      createdAt: props.createdAt || currentDate,
      updatedAt: props.updatedAt || currentDate,
    });
  }

  eventExists(newEvent: MatchEvent): boolean {
    return this.events.some((event) => event.id === newEvent.id);
  }
}
