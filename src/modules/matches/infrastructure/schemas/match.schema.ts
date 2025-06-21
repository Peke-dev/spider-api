import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { MatchTypeEnum, MatchShortStatusEnum } from '../../domain';

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
}

@Schema({
  timestamps: true,
  collection: 'matches',
  toJSON: {
    transform: (_, ret) => {
      delete ret._id;
      delete ret.__v;
      return ret;
    },
  },
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

  @Prop({ type: Object, required: true })
  league: {
    id: string;
    name: string;
    country: string;
    logo: string;
    flag?: string | null;
    season: number;
    round: string;
  };

  @Prop({ type: Object, required: true })
  teams: {
    home: {
      id: number;
      name: string;
      logo: string;
      winner: boolean;
    };
    away: {
      id: number;
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

  @Prop({ required: true })
  createdAt: Date;

  @Prop({ required: true })
  updatedAt: Date;
}

export const MatchSchema = SchemaFactory.createForClass(Match);
export type MatchDocument = Document<Match>;
