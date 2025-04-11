import { v4 as uuidv4 } from 'uuid';

import { Country } from './country.entity';
import { Season } from './season.entity';
import { LeagueStatusEnum, LeagueTypeEnum } from '../enums/league.enum';

export class League {
  id?: string;
  country: Country;
  seasons: Season[];
  name: string;
  logo?: string | null;
  type: LeagueTypeEnum;
  status: LeagueStatusEnum;
  createdAt?: Date;
  updatedAt?: Date;

  constructor(partial: Partial<League>) {
    const date = new Date();
    const defaults = {
      id: uuidv4(),
      createdAt: date,
      updatedAt: date,
      logo: null,
      status: LeagueStatusEnum.DISABLED,
    };

    Object.assign(this, defaults, partial);
  }

  toJSON() {
    return {
      id: this.id,
      country: this.country.toJSON(),
      seasons: this.seasons.map((season) => season.toJSON()),
      name: this.name,
      logo: this.logo,
      type: this.type,
      status: this.status,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }
}
