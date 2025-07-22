import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

import { LeagueStatusEnum, LeagueTypeEnum } from '../../domain/enums/';
import { Country } from '../../domain/entities/country.entity';
import { Season } from '../../domain/entities/season.entity';

@Schema({
  timestamps: true,
  collection: 'leagues',
})
export class League {
  @Prop({ required: true, unique: true, index: true })
  id: string;

  @Prop({ required: true, index: true })
  name: string;

  @Prop({ required: true, enum: LeagueTypeEnum })
  type: LeagueTypeEnum;

  @Prop({
    required: true,
    enum: LeagueStatusEnum,
    default: LeagueStatusEnum.ENABLED,
  })
  status: LeagueStatusEnum;

  @Prop({ type: Object, required: true })
  country: Country;

  @Prop({ type: [Object], required: true })
  seasons: Season[];

  @Prop({ required: false, default: null })
  logo: string;

  @Prop({ required: true })
  createdAt: Date;

  @Prop({ required: true })
  updatedAt: Date;
}

export const LeagueSchema = SchemaFactory.createForClass(League);
export type LeagueDocument = Document<League>;
