import {
  IsDate,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
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
}

export class League {
  @IsNumber()
  @IsNotEmpty()
  id: number;

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
}
