import {
  IsString,
  IsOptional,
  IsNumber,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

class PeriodDto {
  @IsNumber()
  @IsOptional()
  @ApiProperty({ example: 45, required: false })
  first?: number;

  @IsNumber()
  @IsOptional()
  @ApiProperty({ example: 45, required: false })
  second?: number;
}

class VenueDto {
  @IsNumber()
  @IsOptional()
  @ApiProperty({ example: 1, required: false })
  id?: number;

  @IsString()
  @IsOptional()
  @ApiProperty({ example: 'Old Trafford', required: false })
  name?: string;

  @IsString()
  @IsOptional()
  @ApiProperty({ example: 'Manchester', required: false })
  city?: string;
}

class StatusDto {
  @IsString()
  @IsOptional()
  @ApiProperty({ example: 'Match Finished', required: false })
  long?: string;

  @IsString()
  @IsOptional()
  @ApiProperty({ example: 'FT', required: false })
  short?: string;

  @IsNumber()
  @IsOptional()
  @ApiProperty({ example: 90, required: false })
  elapsed?: number;
}

class LeagueDto {
  @IsNumber()
  @IsOptional()
  @ApiProperty({ example: 39, required: false })
  id?: number;

  @IsString()
  @IsOptional()
  @ApiProperty({ example: 'Premier League', required: false })
  name?: string;

  @IsString()
  @IsOptional()
  @ApiProperty({ example: 'England', required: false })
  country?: string;

  @IsString()
  @IsOptional()
  @ApiProperty({
    example: 'https://media.api-sports.io/football/leagues/39.png',
    required: false,
  })
  logo?: string;

  @IsString()
  @IsOptional()
  @ApiProperty({
    example: 'https://media.api-sports.io/flags/gb.svg',
    required: false,
  })
  flag?: string;

  @IsNumber()
  @IsOptional()
  @ApiProperty({ example: 2023, required: false })
  season?: number;

  @IsString()
  @IsOptional()
  @ApiProperty({ example: 'Regular Season - 1', required: false })
  round?: string;
}

class TeamDto {
  @IsNumber()
  @IsOptional()
  @ApiProperty({ example: 33, required: false })
  id?: number;

  @IsString()
  @IsOptional()
  @ApiProperty({ example: 'Manchester United', required: false })
  name?: string;

  @IsString()
  @IsOptional()
  @ApiProperty({
    example: 'https://media.api-sports.io/football/teams/33.png',
    required: false,
  })
  logo?: string;

  @IsOptional()
  @ApiProperty({ example: true, required: false })
  winner?: boolean;
}

class TeamsDto {
  @ValidateNested()
  @Type(() => TeamDto)
  @IsOptional()
  @ApiProperty({ type: TeamDto, required: false })
  home?: TeamDto;

  @ValidateNested()
  @Type(() => TeamDto)
  @IsOptional()
  @ApiProperty({ type: TeamDto, required: false })
  away?: TeamDto;
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

class ScoreResultDto {
  @IsNumber()
  @IsOptional()
  @ApiProperty({ example: 1, required: false })
  home?: number;

  @IsNumber()
  @IsOptional()
  @ApiProperty({ example: 0, required: false })
  away?: number;
}

class ScoreDto {
  @ValidateNested()
  @Type(() => ScoreResultDto)
  @IsOptional()
  @ApiProperty({ type: ScoreResultDto, required: false })
  halftime?: ScoreResultDto;

  @ValidateNested()
  @Type(() => ScoreResultDto)
  @IsOptional()
  @ApiProperty({ type: ScoreResultDto, required: false })
  fulltime?: ScoreResultDto;

  @ValidateNested()
  @Type(() => ScoreResultDto)
  @IsOptional()
  @ApiProperty({ type: ScoreResultDto, required: false })
  extratime?: ScoreResultDto;

  @ValidateNested()
  @Type(() => ScoreResultDto)
  @IsOptional()
  @ApiProperty({ type: ScoreResultDto, required: false })
  penalty?: ScoreResultDto;
}

export class UpdateMatchDto {
  @IsString()
  @IsOptional()
  @ApiProperty({ example: 'A. Taylor', required: false })
  referee?: string;

  @IsString()
  @IsOptional()
  @ApiProperty({ example: 'UTC', required: false })
  timezone?: string;

  @IsString()
  @IsOptional()
  @ApiProperty({ example: '2024-03-16T15:00:00+00:00', required: false })
  date?: string;

  @IsNumber()
  @IsOptional()
  @ApiProperty({ example: 1710601200, required: false })
  timestamp?: number;

  @ValidateNested()
  @Type(() => PeriodDto)
  @IsOptional()
  @ApiProperty({ type: PeriodDto, required: false })
  periods?: PeriodDto;

  @ValidateNested()
  @Type(() => VenueDto)
  @IsOptional()
  @ApiProperty({ type: VenueDto, required: false })
  venue?: VenueDto;

  @ValidateNested()
  @Type(() => StatusDto)
  @IsOptional()
  @ApiProperty({ type: StatusDto, required: false })
  status?: StatusDto;

  @ValidateNested()
  @Type(() => LeagueDto)
  @IsOptional()
  @ApiProperty({ type: LeagueDto, required: false })
  league?: LeagueDto;

  @ValidateNested()
  @Type(() => TeamsDto)
  @IsOptional()
  @ApiProperty({ type: TeamsDto, required: false })
  teams?: TeamsDto;

  @ValidateNested()
  @Type(() => GoalsDto)
  @IsOptional()
  @ApiProperty({ type: GoalsDto, required: false })
  goals?: GoalsDto;

  @ValidateNested()
  @Type(() => ScoreDto)
  @IsOptional()
  @ApiProperty({ type: ScoreDto, required: false })
  score?: ScoreDto;
}
