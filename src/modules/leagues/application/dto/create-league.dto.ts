import {
  IsNotEmpty,
  IsString,
  IsArray,
  ValidateNested,
  IsNumber,
  IsBoolean,
  IsUUID,
  IsOptional,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { LeagueTypeEnum } from '@modules/leagues/domain/enums';

class SeasonDto {
  @IsNumber({}, { message: 'Year must be a number' })
  @IsNotEmpty({ message: 'Year is required' })
  @ApiProperty({ example: 2023 })
  year: number;

  @IsString({ message: 'Start date must be a string' })
  @IsNotEmpty({ message: 'Start date is required' })
  @ApiProperty({ example: '2023-08-11' })
  start: string;

  @IsString({ message: 'End date must be a string' })
  @IsNotEmpty({ message: 'End date is required' })
  @ApiProperty({ example: '2024-05-19' })
  end: string;

  @IsBoolean({ message: 'Current must be a boolean' })
  @IsNotEmpty({ message: 'Current is required' })
  @ApiProperty({ example: true })
  current: boolean;
}

export class CreateCountryDto {
  @IsString({ message: 'Name must be a string' })
  @IsNotEmpty({ message: 'Name is required' })
  @ApiProperty({ example: 'England' })
  name: string;

  @IsString({ message: 'Code must be a string' })
  @IsNotEmpty({ message: 'Code is required' })
  @ApiProperty({ example: 'ENG' })
  @IsOptional()
  code: string | null = null;

  @IsString({ message: 'Flag must be a string' })
  @IsNotEmpty({ message: 'Flag is required' })
  @ApiProperty({ example: 'https://media.api-sports.io/flags/eng.svg' })
  @IsOptional()
  flag: string | null = null;
}

export class CreateLeagueDto {
  @IsUUID()
  @IsNotEmpty({ message: 'Id is required' })
  @ApiProperty({ example: '123e4567-e89b-12d3-a456-426614174000' })
  id: string;

  @IsString({ message: 'Name must be a string' })
  @IsNotEmpty({ message: 'Name is required' })
  @ApiProperty({ example: 'Premier League' })
  name: string;

  @Type(() => CreateCountryDto)
  @ValidateNested()
  @ApiProperty({
    type: CreateCountryDto,
    example: {
      name: 'England',
      code: 'ENG',
      flag: 'https://media.api-sports.io/flags/eng.svg',
    },
  })
  country: CreateCountryDto;

  @IsString({ message: 'Logo must be a string' })
  @IsNotEmpty({ message: 'Logo is required' })
  @ApiProperty({
    example: 'https://media.api-sports.io/football/leagues/39.png',
  })
  logo: string;

  @IsString({ message: 'Type must be a string' })
  @IsNotEmpty({ message: 'Type is required' })
  @ApiProperty({
    enumName: 'LeagueType',
    enum: LeagueTypeEnum,
    example: LeagueTypeEnum.LEAGUE,
  })
  type: LeagueTypeEnum;

  @IsArray({ message: 'Seasons must be an array' })
  @ValidateNested({ each: true })
  @Type(() => SeasonDto)
  @ApiProperty({
    type: [SeasonDto],
    example: [
      {
        year: 2023,
        start: '2023-08-11',
        end: '2024-05-19',
        current: true,
      },
    ],
  })
  seasons: SeasonDto[];
}
