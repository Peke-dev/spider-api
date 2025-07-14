import { v5 as uuidv5 } from 'uuid';

type newMatchEventParams = {
  matchId: string;
  time: {
    elapsed: number;
    extra: number | null;
  };
  team: {
    id: string;
    name: string;
    logo: string;
  };
  player: {
    id: string | null;
    name: string | null;
  };
  assist: {
    id: string | null;
    name: string | null;
  };
  type: string;
  detail: string;
  comments?: string | null;
  createdAt?: Date;
  updatedAt?: Date;
};

export class EventIdValueObject {
  id: string;

  constructor(matchId, elapsed: number, teamId: string) {
    if (!matchId) {
      throw new Error('Match ID is required');
    }

    this.id = uuidv5(
      `${matchId}-${elapsed}-${teamId}`,
      '6ba7b810-9dad-11d1-80b4-00c04fd430c8',
    );
  }
}

export class MatchEvent {
  id: string;
  time: {
    elapsed: number;
    extra: number | null;
  };
  team: {
    id: string;
    name: string;
    logo: string;
  };
  player: {
    id: string | null;
    name: string | null;
  };
  assist: {
    id: string | null;
    name: string | null;
  };
  type: string;
  detail: string;
  comments?: string | null;
  createdAt: Date;
  updatedAt: Date;
  matchId: string;

  constructor(props: newMatchEventParams) {
    const currentDate = new Date();
    const { matchId, time, team, createdAt, updatedAt } = props;

    const id = new EventIdValueObject(matchId, time.elapsed, team.id).id;

    this.createdAt = createdAt || currentDate;
    this.updatedAt = updatedAt || currentDate;

    if (!props.comments) {
      this.comments = null;
    }

    Object.assign(this, {
      ...props,
      id,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    });
  }
}
