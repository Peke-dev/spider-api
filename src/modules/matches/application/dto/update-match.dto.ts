import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsOptional,
  IsNumber,
  ValidateNested,
  IsUUID,
  IsEnum,
  IsBoolean,
  ValidateIf,
} from 'class-validator';
import { Type } from 'class-transformer';

import { MatchShortStatusEnum, MatchTypeEnum } from '../../domain';

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
  @IsUUID()
  @IsOptional()
  @ApiProperty({
    example: '123e4567-e89b-12d3-a456-426614174000',
    required: false,
  })
  id?: string;

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

  @IsEnum(MatchShortStatusEnum)
  @IsOptional()
  @ApiProperty({ example: MatchShortStatusEnum.FT, required: false })
  short?: MatchShortStatusEnum;

  @IsNumber()
  @IsOptional()
  @ApiProperty({ example: 90, required: false })
  elapsed?: number;

  @IsEnum(MatchTypeEnum)
  @IsOptional()
  @ApiProperty({ example: MatchTypeEnum.FINISHED, required: false })
  type?: MatchTypeEnum;

  @IsNumber()
  @IsOptional()
  @ApiProperty({ example: 0, required: false })
  extra?: number | null;
}

class LeagueDto {
  @IsUUID()
  @IsOptional()
  @ApiProperty({ example: '123e4567-e89b-12d3-a456-426614174000' })
  id?: string;

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

  @IsBoolean()
  @IsOptional()
  @ApiProperty({ example: true, required: false })
  standings?: boolean;
}

class TeamDto {
  @IsUUID()
  @IsOptional()
  @ApiProperty({
    example: '123e4567-e89b-12d3-a456-426614174000',
    required: false,
  })
  id?: string;

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

class MatchEventTeamDto {
  @IsUUID()
  @ApiProperty({ example: '123e4567-e89b-12d3-a456-426614174000' })
  id: string;

  @IsString()
  @ApiProperty({ example: 'Team 1' })
  name: string;

  @IsString()
  @ApiProperty({
    example: 'https://media.api-sports.io/football/teams/33.png',
  })
  logo: string;
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
  @ValidateIf((object, value) => value !== null)
  @ApiProperty({ example: 2 })
  home: number | null;

  @IsNumber()
  @ValidateIf((object, value) => value !== null)
  @ApiProperty({ example: 1 })
  away: number | null;
}

class ScoreResultDto {
  @IsNumber()
  @ValidateIf((object, value) => value !== null)
  @ApiProperty({ example: 1 })
  home: number | null;

  @IsNumber()
  @ValidateIf((object, value) => value !== null)
  @ApiProperty({ example: 0 })
  away: number | null;
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

class TimeDto {
  @IsNumber()
  @ApiProperty({ example: 10 })
  elapsed: number;

  @IsNumber()
  @ApiProperty({ example: 0 })
  @ValidateIf((object, value) => value !== null)
  extra: number | null;
}

class PlayerDto {
  @IsString()
  @ValidateIf((object, value) => value !== null)
  @ApiProperty({ example: 'Player 1' })
  name: string | null;

  @IsUUID()
  @ValidateIf((object, value) => value !== null)
  @ApiProperty({ example: '123e4567-e89b-12d3-a456-426614174000' })
  id: string | null;
}

class AssistDto {
  @IsString()
  @ApiProperty({ example: 'Assist 1' })
  @ValidateIf((object, value) => value !== null)
  name: string | null;

  @IsUUID()
  @ApiProperty({ example: '123e4567-e89b-12d3-a456-426614174000' })
  @ValidateIf((object, value) => value !== null)
  id: string | null;
}

export class UpdateMatchEventDto {
  @ApiProperty({
    example: { elapsed: 10, extra: null },
    description: 'Time of the match event',
  })
  @ValidateNested()
  @Type(() => TimeDto)
  @ApiProperty({ type: TimeDto })
  time: TimeDto;

  @ApiProperty({
    example: {
      id: '123e4567-e89b-12d3-a456-426614174000',
      name: 'Team 1',
      logo: 'https://example.com/logo.png',
    },
    description: 'Team of the match event',
  })
  @ValidateNested()
  @Type(() => MatchEventTeamDto)
  @ApiProperty({ type: MatchEventTeamDto })
  team: MatchEventTeamDto;

  @ApiProperty({
    example: { id: '123e4567-e89b-12d3-a456-426614174000', name: 'Player 1' },
    description: 'Player of the match event',
  })
  @ValidateNested()
  @Type(() => PlayerDto)
  @ApiProperty({ type: PlayerDto })
  player: PlayerDto;

  @ApiProperty({
    example: { id: '123e4567-e89b-12d3-a456-426614174000', name: 'Assist 1' },
    description: 'Assist of the match event',
  })
  @ValidateNested()
  @Type(() => AssistDto)
  @ApiProperty({ type: AssistDto })
  assist: AssistDto;

  @ApiProperty({
    example: 'goal',
    description: 'Type of the match event',
  })
  @IsString()
  @ApiProperty({ example: 'goal' })
  type: string;

  @ApiProperty({
    example: 'Goal scored by Player 1',
    description: 'Detail of the match event',
  })
  @IsString()
  detail: string;

  @ApiProperty({
    example: 'Great goal by Player 1',
    description: 'Comments of the match event',
  })
  @IsString()
  @ApiProperty({ example: 'Great goal by Player 1' })
  @ValidateIf((object, value) => value !== null)
  comments: string | null;
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

  @ValidateNested()
  @Type(() => UpdateMatchEventDto)
  @IsOptional()
  @ApiProperty({
    type: UpdateMatchEventDto,
    required: false,
    isArray: true,
  })
  events?: UpdateMatchEventDto[];
}
