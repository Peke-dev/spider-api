import {
  IsString,
  IsOptional,
  IsEnum,
  ValidateNested,
  IsArray,
  IsNotEmpty,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { LeagueStatusEnum } from '@modules/leagues/domain/enums';
import { SeasonDto } from './shared.dto';

export class UpdateLeagueDto {
  @IsString({ message: 'Name must be a string' })
  @IsNotEmpty({ message: 'Name is required' })
  @ApiProperty({ example: 'Premier League' })
  @IsOptional()
  name?: string;

  @IsString({ message: 'Logo must be a string' })
  @IsOptional()
  @ApiProperty({ example: 'https://example.com/logo.png', required: false })
  logo?: string | null;

  @IsEnum(LeagueStatusEnum, { message: 'Status must be a valid league status' })
  @IsOptional()
  @ApiProperty({
    enumName: 'LeagueStatus',
    enum: LeagueStatusEnum,
    example: LeagueStatusEnum.ENABLED,
  })
  status?: LeagueStatusEnum;

  @IsArray({ message: 'Seasons must be an array' })
  @ValidateNested({ each: true })
  @Type(() => SeasonDto)
  @IsOptional()
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
  seasons?: SeasonDto[];
}
