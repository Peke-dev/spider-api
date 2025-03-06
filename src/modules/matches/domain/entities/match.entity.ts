import {
  IsString,
  IsNumber,
  IsOptional,
  ValidateNested,
  IsBoolean,
  IsDate,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

class Period {
  @IsNumber()
  @ApiProperty({ example: 45 })
  first: number;

  @IsNumber()
  @ApiProperty({ example: 45 })
  second: number;
}

class Venue {
  @IsNumber()
  @ApiProperty({ example: 1 })
  id: number;

  @IsString()
  @ApiProperty({ example: 'Old Trafford' })
  name: string;

  @IsString()
  @ApiProperty({ example: 'Manchester' })
  city: string;
}

class Status {
  @IsString()
  @ApiProperty({ example: 'Match Finished' })
  long: string;

  @IsString()
  @ApiProperty({ example: 'FT' })
  short: string;

  @IsNumber()
  @ApiProperty({ example: 90 })
  elapsed: number;
}

class League {
  @IsNumber()
  @ApiProperty({ example: 39 })
  id: number;

  @IsString()
  @ApiProperty({ example: 'Premier League' })
  name: string;

  @IsString()
  @ApiProperty({ example: 'England' })
  country: string;

  @IsString()
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
  flag?: string | null;

  @IsNumber()
  @ApiProperty({ example: 2023 })
  season: number;

  @IsString()
  @ApiProperty({ example: 'Regular Season - 1' })
  round: string;
}

class Team {
  @IsNumber()
  @ApiProperty({ example: 33 })
  id: number;

  @IsString()
  @ApiProperty({ example: 'Manchester United' })
  name: string;

  @IsString()
  @ApiProperty({ example: 'https://media.api-sports.io/football/teams/33.png' })
  logo: string;

  @IsBoolean()
  @ApiProperty({ example: true })
  winner: boolean;
}

class Teams {
  @ValidateNested()
  @Type(() => Team)
  @ApiProperty({ type: Team })
  home: Team;

  @ValidateNested()
  @Type(() => Team)
  @ApiProperty({ type: Team })
  away: Team;
}

class Goals {
  @IsNumber()
  @IsOptional()
  @ApiProperty({ example: 2, required: false })
  home?: number | null;

  @IsNumber()
  @IsOptional()
  @ApiProperty({ example: 1, required: false })
  away?: number | null;
}

class ScoreResult {
  @IsNumber()
  @IsOptional()
  @ApiProperty({ example: 2, required: false })
  home?: number | null;

  @IsNumber()
  @IsOptional()
  @ApiProperty({ example: 1, required: false })
  away?: number | null;
}

class Score {
  @ValidateNested()
  @Type(() => ScoreResult)
  @ApiProperty({ type: ScoreResult })
  halftime: ScoreResult;

  @ValidateNested()
  @Type(() => ScoreResult)
  @ApiProperty({ type: ScoreResult })
  fulltime: ScoreResult;

  @ValidateNested()
  @Type(() => ScoreResult)
  @ApiProperty({ type: ScoreResult })
  extratime: ScoreResult;

  @ValidateNested()
  @Type(() => ScoreResult)
  @ApiProperty({ type: ScoreResult })
  penalty: ScoreResult;
}

export class Match {
  @IsString()
  @ApiProperty({ example: '1' })
  id: string;

  @IsString()
  @IsOptional()
  @ApiProperty({ example: 'A. Taylor', required: false })
  referee?: string | null;

  @IsString()
  @ApiProperty({ example: 'UTC' })
  timezone: string;

  @IsString()
  @ApiProperty({ example: '2024-03-16T15:00:00+00:00' })
  date: string;

  @IsNumber()
  @ApiProperty({ example: 1710601200 })
  timestamp: number;

  @ValidateNested()
  @Type(() => Period)
  @ApiProperty({ type: Period })
  periods: Period;

  @ValidateNested()
  @Type(() => Venue)
  @ApiProperty({ type: Venue })
  venue: Venue;

  @ValidateNested()
  @Type(() => Status)
  @ApiProperty({ type: Status })
  status: Status;

  @ValidateNested()
  @Type(() => League)
  @ApiProperty({ type: League })
  league: League;

  @ValidateNested()
  @Type(() => Teams)
  @ApiProperty({ type: Teams })
  teams: Teams;

  @ValidateNested()
  @Type(() => Goals)
  @ApiProperty({ type: Goals })
  goals: Goals;

  @ValidateNested()
  @Type(() => Score)
  @ApiProperty({ type: Score })
  score: Score;

  @IsDate()
  @Type(() => Date)
  @ApiProperty({ example: new Date() })
  createdAt: Date;

  @IsDate()
  @Type(() => Date)
  @ApiProperty({ example: new Date() })
  updatedAt: Date;

  constructor(props: Partial<Match>) {
    Object.assign(this, props);
  }
}
