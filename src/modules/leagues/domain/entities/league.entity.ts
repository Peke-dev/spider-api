import { IsNotEmpty, IsString, IsDate, IsOptional } from 'class-validator';
import { IsEnum, ValidateNested, IsArray } from 'class-validator';
import { v4 as uuidv4 } from 'uuid';

import { Country } from './country.entity';
import { Season } from './season.entity';
import { LeagueStatusEnum, LeagueTypeEnum } from '../enums/league.enum';

export class League {
  @IsString()
  @IsOptional()
  id?: string;

  @ValidateNested()
  country: Country;

  @IsArray()
  @ValidateNested({ each: true })
  seasons: Season[];

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsOptional()
  logo: string | null = null;

  @IsEnum(LeagueTypeEnum)
  @IsNotEmpty()
  type: LeagueTypeEnum;

  @IsEnum(LeagueStatusEnum)
  @IsOptional()
  status: LeagueStatusEnum = LeagueStatusEnum.ENABLED;

  @IsDate()
  @IsNotEmpty()
  createdAt: Date;

  @IsDate()
  @IsNotEmpty()
  updatedAt: Date;

  constructor(partial: Partial<League>) {
    let { id } = partial;

    id = id ?? uuidv4();

    Object.assign(this, { id, ...partial });
  }
}
