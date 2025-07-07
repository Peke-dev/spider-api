import { ApiProperty } from '@nestjs/swagger';
import { LeagueStatusEnum, LeagueTypeEnum } from '../../domain/enums';

export class CreateLeagueResponseDto {
  @ApiProperty({
    example: '123e4567-e89b-12d3-a456-426614174000',
    description: 'Unique identifier of the created league',
  })
  id: string;
}

export class UpdateLeagueResponseDto {
  @ApiProperty({
    example: 'League updated successfully',
    description: 'Success message confirming the league was updated',
  })
  message: string;
}

export class CountryResponseDto {
  @ApiProperty({
    example: 'England',
    description: 'Name of the country',
  })
  name: string;

  @ApiProperty({
    example: 'ENG',
    description: 'Country code (ISO format)',
    required: false,
  })
  code?: string | null;

  @ApiProperty({
    example: 'https://media.api-sports.io/flags/eng.svg',
    description: 'URL to the country flag image',
    required: false,
  })
  flag?: string | null;
}

export class SeasonResponseDto {
  @ApiProperty({
    example: 2023,
    description: 'Year of the season',
  })
  year: number;

  @ApiProperty({
    example: '2023-08-11',
    description: 'Start date of the season in YYYY-MM-DD format',
  })
  start: string;

  @ApiProperty({
    example: '2024-05-19',
    description: 'End date of the season in YYYY-MM-DD format',
  })
  end: string;

  @ApiProperty({
    example: true,
    description: 'Whether this is the current season',
  })
  current: boolean;
}

export class LeagueResponseDto {
  @ApiProperty({
    example: '123e4567-e89b-12d3-a456-426614174000',
    description: 'Unique identifier of the league',
  })
  id?: string;

  @ApiProperty({
    example: 'Premier League',
    description: 'Name of the league',
  })
  name: string;

  @ApiProperty({
    example: 'https://media.api-sports.io/football/leagues/39.png',
    description: 'URL to the league logo image',
    required: false,
  })
  logo?: string | null;

  @ApiProperty({
    enum: LeagueTypeEnum,
    example: LeagueTypeEnum.LEAGUE,
    description: 'Type of the league',
  })
  type: LeagueTypeEnum;

  @ApiProperty({
    enum: LeagueStatusEnum,
    example: LeagueStatusEnum.ENABLED,
    description: 'Status of the league',
  })
  status: LeagueStatusEnum;

  @ApiProperty({
    type: CountryResponseDto,
    example: {
      name: 'England',
      code: 'ENG',
      flag: 'https://media.api-sports.io/flags/eng.svg',
    },
    description: 'Country information',
  })
  country: CountryResponseDto;

  @ApiProperty({
    type: [SeasonResponseDto],
    example: [
      {
        year: 2023,
        start: '2023-08-11',
        end: '2024-05-19',
        current: true,
      },
      {
        year: 2024,
        start: '2024-08-10',
        end: '2025-05-18',
        current: false,
      },
    ],
    description: 'List of seasons for this league',
  })
  seasons: SeasonResponseDto[];

  @ApiProperty({
    example: '2024-01-15T10:30:00.000Z',
    description: 'Creation timestamp',
  })
  createdAt?: Date;

  @ApiProperty({
    example: '2024-01-15T10:30:00.000Z',
    description: 'Last update timestamp',
  })
  updatedAt?: Date;
}

export class ErrorResponseDto {
  @ApiProperty({
    example: 400,
    description: 'HTTP status code',
  })
  statusCode: number;

  @ApiProperty({
    example: 'Bad Request',
    description: 'Error message',
  })
  message: string;

  @ApiProperty({
    example: 'Bad Request',
    description: 'Error type',
  })
  error: string;
}
