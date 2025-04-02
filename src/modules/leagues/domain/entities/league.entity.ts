import { v4 as uuidv4 } from 'uuid';

import { Country } from './country.entity';
import { Season } from './season.entity';
import { LeagueStatusEnum, LeagueTypeEnum } from '../enums/league.enum';

export class League {
  id?: string;
  country: Country;
  seasons: Season[];
  name: string;
  logo: string | null = null;
  type: LeagueTypeEnum;
  status: LeagueStatusEnum = LeagueStatusEnum.ENABLED;
  createdAt?: Date;
  updatedAt?: Date;

  constructor(partial: Partial<League>) {
    const date = new Date();
    const defaults = {
      id: uuidv4(),
      createdAt: date,
      updatedAt: date,
      logo: null,
      status: LeagueStatusEnum.ENABLED,
    };

    Object.assign(this, defaults, partial);
  }
}
