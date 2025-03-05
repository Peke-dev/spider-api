import {
  IsNotEmpty,
  IsString,
  IsDate,
  IsNumber,
  IsOptional,
  IsBoolean,
  ValidateNested,
  IsArray,
} from 'class-validator';

class Country {
  @IsString()
  @IsOptional()
  code: string | null;

  @IsString()
  @IsOptional()
  flag: string | null;

  @IsString()
  @IsNotEmpty()
  name: string;

  constructor(partial: Partial<Country>) {
    Object.assign(this, partial);
  }
}

class Season {
  @IsBoolean()
  current: boolean;

  @IsNumber()
  year: number;

  @IsString()
  start: string;

  @IsString()
  end: string;

  constructor(partial: Partial<Season>) {
    Object.assign(this, partial);
  }
}

export class League {
  @IsString()
  @IsNotEmpty()
  id: string;

  @ValidateNested()
  country: Country;

  @IsArray()
  @ValidateNested({ each: true })
  seasons: Season[];

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  logo: string;

  @IsString()
  @IsNotEmpty()
  type: string;

  @IsString()
  @IsNotEmpty()
  round: string;

  @IsDate()
  @IsNotEmpty()
  createdAt: Date;

  @IsDate()
  @IsNotEmpty()
  updatedAt: Date;

  constructor(partial: Partial<League>) {
    Object.assign(this, partial);
  }
}
