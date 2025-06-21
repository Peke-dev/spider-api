import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsString,
  IsNumber,
  IsOptional,
  ValidateNested,
  IsBoolean,
  IsUUID,
  IsEnum,
} from 'class-validator';
import { Type } from 'class-transformer';

import { MatchShortStatusEnum } from '../../domain';

class PeriodDto {
  @IsNumber()
  @IsNotEmpty()
  @ApiProperty({ example: 45 })
  first: number;

  @IsNumber()
  @IsNotEmpty()
  @ApiProperty({ example: 45 })
  second: number;
}

class VenueDto {
  @IsUUID()
  @IsOptional()
  @ApiProperty({ example: '123e4567-e89b-12d3-a456-426614174000' })
  id?: string | null;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: 'Old Trafford' })
  name: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: 'Manchester' })
  city: string;
}

class StatusDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: 'Match Finished' })
  long: string;

  @IsEnum(MatchShortStatusEnum)
  @IsNotEmpty()
  @ApiProperty({ example: MatchShortStatusEnum.FT })
  short: MatchShortStatusEnum;

  @IsNumber()
  @IsNotEmpty()
  @ApiProperty({ example: 90 })
  elapsed: number;
}

class LeagueDto {
  @IsUUID()
  @IsNotEmpty()
  @ApiProperty({ example: '123e4567-e89b-12d3-a456-426614174000' })
  id: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: 'Premier League' })
  name: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: 'England' })
  country: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    example: 'https://media.api-sports.io/football/leagues/39.png',
  })
  logo: string;

  @IsString()
  @IsOptional()
  @ApiProperty({
    example: 'https://media.api-sports.io/flags/gb.svg',
    required: false,
  })
  flag?: string;

  @IsNumber()
  @IsNotEmpty()
  @ApiProperty({ example: 2023 })
  season: number;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: 'Regular Season - 1' })
  round: string;
}

class TeamDto {
  @IsUUID()
  @IsNotEmpty()
  @ApiProperty({ example: '123e4567-e89b-12d3-a456-426614174000' })
  id: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: 'Manchester United' })
  name: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: 'https://media.api-sports.io/football/teams/33.png' })
  logo: string;

  @IsBoolean()
  @IsNotEmpty()
  @ApiProperty({ example: true })
  winner: boolean;
}

class TeamsDto {
  @ValidateNested()
  @Type(() => TeamDto)
  @ApiProperty({ type: TeamDto })
  home: TeamDto;

  @ValidateNested()
  @Type(() => TeamDto)
  @ApiProperty({ type: TeamDto })
  away: TeamDto;
}

class ScoreResultDto {
  @IsNumber()
  @IsOptional()
  @ApiProperty({ example: 2, required: false })
  home?: number | null;

  @IsNumber()
  @IsOptional()
  @ApiProperty({ example: 1, required: false })
  away?: number | null;
}

class ScoreDto {
  @ValidateNested()
  @Type(() => ScoreResultDto)
  @ApiProperty({ type: ScoreResultDto })
  halftime: ScoreResultDto;

  @ValidateNested()
  @Type(() => ScoreResultDto)
  @ApiProperty({ type: ScoreResultDto })
  fulltime: ScoreResultDto;

  @ValidateNested()
  @Type(() => ScoreResultDto)
  @ApiProperty({ type: ScoreResultDto })
  extratime: ScoreResultDto;

  @ValidateNested()
  @Type(() => ScoreResultDto)
  @ApiProperty({ type: ScoreResultDto })
  penalty: ScoreResultDto;
}

class GoalsDto {
  @IsNumber()
  @IsOptional()
  @ApiProperty({ example: 2, required: false })
  home?: number;

  @IsNumber()
  @IsOptional()
  @ApiProperty({ example: 1, required: false })
  away?: number;
}

export class CreateMatchDto {
  @IsUUID()
  @IsNotEmpty()
  @ApiProperty({ example: '123e4567-e89b-12d3-a456-426614174000' })
  id: string;

  @IsString()
  @IsOptional()
  @ApiProperty({ example: 'A. Taylor', required: false })
  referee?: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: 'UTC' })
  timezone: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: '2024-03-16T15:00:00+00:00' })
  date: string;

  @IsNumber()
  @IsNotEmpty()
  @ApiProperty({ example: 1710601200 })
  timestamp: number;

  @ValidateNested()
  @Type(() => PeriodDto)
  @ApiProperty({ type: PeriodDto })
  periods: PeriodDto;

  @ValidateNested()
  @Type(() => VenueDto)
  @ApiProperty({ type: VenueDto })
  venue: VenueDto;

  @ValidateNested()
  @Type(() => StatusDto)
  @ApiProperty({ type: StatusDto })
  status: StatusDto;

  @ValidateNested()
  @Type(() => LeagueDto)
  @ApiProperty({ type: LeagueDto })
  league: LeagueDto;

  @ValidateNested()
  @Type(() => TeamsDto)
  @ApiProperty({ type: TeamsDto })
  teams: TeamsDto;

  @ValidateNested()
  @Type(() => GoalsDto)
  @ApiProperty({ type: GoalsDto })
  goals: GoalsDto;

  @ValidateNested()
  @Type(() => ScoreDto)
  @ApiProperty({ type: ScoreDto })
  score: ScoreDto;
}
