import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsString,
  IsNumber,
  IsOptional,
  ValidateNested,
  IsUUID,
} from 'class-validator';
import { Type } from 'class-transformer';

class TimeDto {
  @IsNumber()
  @IsNotEmpty()
  @ApiProperty({ example: 45, description: 'Elapsed time in minutes' })
  elapsed: number;

  @IsNumber()
  @IsOptional()
  @ApiProperty({
    example: 2,
    required: false,
    description: 'Extra time in minutes',
  })
  extra?: number | null;
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
}

class PlayerDto {
  @IsUUID()
  @IsOptional()
  @ApiProperty({
    example: '123e4567-e89b-12d3-a456-426614174000',
    required: false,
  })
  id?: string | null;

  @IsString()
  @IsOptional()
  @ApiProperty({ example: 'Marcus Rashford', required: false })
  name?: string | null;
}

class AssistDto {
  @IsUUID()
  @IsOptional()
  @ApiProperty({
    example: '123e4567-e89b-12d3-a456-426614174000',
    required: false,
  })
  id?: string | null;

  @IsString()
  @IsOptional()
  @ApiProperty({ example: 'Bruno Fernandes', required: false })
  name?: string | null;
}

export class CreateMatchEventDto {
  @ValidateNested()
  @Type(() => TimeDto)
  @ApiProperty({ type: TimeDto, description: 'Time information for the event' })
  time: TimeDto;

  @ValidateNested()
  @Type(() => TeamDto)
  @ApiProperty({ type: TeamDto, description: 'Team information for the event' })
  team: TeamDto;

  @ValidateNested()
  @Type(() => PlayerDto)
  @ApiProperty({
    type: PlayerDto,
    description: 'Player information for the event',
  })
  player: PlayerDto;

  @ValidateNested()
  @Type(() => AssistDto)
  @ApiProperty({
    type: AssistDto,
    description: 'Assist information for the event',
  })
  assist: AssistDto;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    example: 'Goal',
    description: 'Type of event (Goal, Card, Substitution, etc.)',
  })
  type: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: 'Normal Goal', description: 'Detail of the event' })
  detail: string;

  @IsString()
  @IsOptional()
  @ApiProperty({
    example: 'Great finish from outside the box',
    required: false,
  })
  comments: string | null;
}
