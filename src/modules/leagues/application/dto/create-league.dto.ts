import {
  IsNotEmpty,
  IsString,
  IsArray,
  ValidateNested,
  IsUUID,
  IsEnum,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { LeagueTypeEnum } from '@modules/leagues/domain/enums';
import { CreateCountryDto, SeasonDto } from './shared.dto';

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

  @IsEnum(LeagueTypeEnum, { message: 'Type must be a valid league type' })
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
