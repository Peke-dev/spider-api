import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { MatchTypeEnum, MatchShortStatusEnum } from '../../domain';

class MatchLeagueSchema {
  @Prop({ type: String, index: true })
  id: string;

  @Prop({ type: String })
  name: string;

  @Prop({ type: String })
  country: string;

  @Prop({ type: String })
  logo: string;

  @Prop({ type: String, required: false, default: null })
  flag?: string | null;

  @Prop({ type: Number })
  season: number;

  @Prop({ type: String })
  round: string;

  @Prop({ type: Boolean, required: false, default: null })
  standings?: boolean | null;
}

export class VenueSchema {
  @Prop({ type: String, default: null })
  id: string | null;

  @Prop({ type: String, required: true })
  name: string;

  @Prop({ type: String, required: true })
  city: string;
}

export class StatusSchema {
  @Prop({ type: String, required: true })
  long: string;

  @Prop({ type: MatchShortStatusEnum, required: true })
  short: MatchShortStatusEnum;

  @Prop({ type: Number, required: true })
  elapsed: number;

  @Prop({ type: MatchTypeEnum, required: true })
  type: MatchTypeEnum;

  @Prop({ type: Number, required: false, default: null })
  extra: number | null;
}

@Schema({
  timestamps: true,
  collection: 'matches',
})
export class Match {
  @Prop({ required: true, unique: true, index: true })
  id: string;

  @Prop({ required: false, default: null })
  referee: string;

  @Prop({ required: true })
  timezone: string;

  @Prop({ required: true })
  date: Date;

  @Prop({ required: true })
  timestamp: number;

  @Prop({ type: Object, required: true })
  periods: {
    first: number;
    second: number;
  };

  @Prop({
    type: VenueSchema,
    required: false,
    default: null,
  })
  venue: VenueSchema;

  @Prop({ type: StatusSchema, required: true })
  status: StatusSchema;

  @Prop({ type: MatchLeagueSchema, required: true })
  league: MatchLeagueSchema;

  @Prop({ type: Object, required: true })
  teams: {
    home: {
      id: string;
      name: string;
      logo: string;
      winner: boolean;
    };
    away: {
      id: string;
      name: string;
      logo: string;
      winner: boolean;
    };
  };

  @Prop({ type: Object, required: true })
  goals: {
    home?: number | null;
    away?: number | null;
  };

  @Prop({ type: Object, required: true })
  score: {
    halftime: {
      home?: number | null;
      away?: number | null;
    };
    fulltime: {
      home?: number | null;
      away?: number | null;
    };
    extratime: {
      home?: number | null;
      away?: number | null;
    };
    penalty: {
      home?: number | null;
      away?: number | null;
    };
  };

  @Prop({ type: Array, required: false, default: [] })
  events: Array<{
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
    comments: string | null;
  }>;

  @Prop({ required: true })
  createdAt: Date;

  @Prop({ required: true })
  updatedAt: Date;
}

export const MatchSchema = SchemaFactory.createForClass(Match);
export type MatchDocument = Document<Match>;
