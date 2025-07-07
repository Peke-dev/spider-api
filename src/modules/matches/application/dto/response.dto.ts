import { ApiProperty } from '@nestjs/swagger';
import { Match } from '../../domain';

export class CreateMatchResponseDto {
  @ApiProperty({
    example: '123e4567-e89b-12d3-a456-426614174000',
    description: 'Unique identifier of the created match',
  })
  id: string;

  @ApiProperty({
    example: 'Match created successfully',
    description: 'Success message confirming the match was created',
  })
  message: string;
}

export class UpdateMatchResponseDto {
  @ApiProperty({
    example: 'Match updated successfully',
    description: 'Success message confirming the match was updated',
  })
  message: string;
}

export class MatchResponseDto implements Match {
  @ApiProperty({
    example: '123e4567-e89b-12d3-a456-426614174000',
    description: 'Unique identifier of the match',
  })
  id?: string;

  @ApiProperty({
    example: 'A. Taylor',
    description: 'Name of the match referee',
    required: false,
  })
  referee?: string | null;

  @ApiProperty({
    example: 'UTC',
    description: 'Timezone of the match',
  })
  timezone: string;

  @ApiProperty({
    example: '2024-03-16T15:00:00+00:00',
    description: 'Date and time of the match in ISO format',
  })
  date: string;

  @ApiProperty({
    example: 1710601200,
    description: 'Unix timestamp of the match',
  })
  timestamp: number;

  @ApiProperty({
    example: { first: 45, second: 45 },
    description: 'Match periods duration in minutes',
  })
  periods: {
    first: number;
    second: number;
  };

  @ApiProperty({
    example: {
      id: 1,
      name: 'Old Trafford',
      city: 'Manchester',
    },
    description: 'Match venue information',
  })
  venue: {
    id: number;
    name: string;
    city: string;
  };

  @ApiProperty({
    example: {
      long: 'Match Finished',
      short: 'FT',
      elapsed: 90,
    },
    description: 'Match status information',
  })
  status: {
    long: string;
    short: string;
    elapsed: number;
  };

  @ApiProperty({
    example: {
      id: '123e4567-e89b-12d3-a456-426614174000',
      name: 'Premier League',
      country: 'England',
      logo: 'https://media.api-sports.io/football/leagues/39.png',
      flag: 'https://media.api-sports.io/flags/gb.svg',
      season: 2023,
      round: 'Regular Season - 1',
    },
    description: 'League information',
  })
  league: {
    id: string;
    name: string;
    country: string;
    logo: string;
    flag?: string | null;
    season: number;
    round: string;
  };

  @ApiProperty({
    example: {
      home: {
        id: 33,
        name: 'Manchester United',
        logo: 'https://media.api-sports.io/football/teams/33.png',
        winner: true,
      },
      away: {
        id: 34,
        name: 'Manchester City',
        logo: 'https://media.api-sports.io/football/teams/34.png',
        winner: false,
      },
    },
    description: 'Teams participating in the match',
  })
  teams: {
    home: {
      id: number;
      name: string;
      logo: string;
      winner: boolean;
    };
    away: {
      id: number;
      name: string;
      logo: string;
      winner: boolean;
    };
  };

  @ApiProperty({
    example: { home: 2, away: 1 },
    description: 'Goals scored by each team',
    required: false,
  })
  goals: {
    home: number | null;
    away: number | null;
  };

  @ApiProperty({
    example: {
      halftime: { home: 1, away: 0 },
      fulltime: { home: 2, away: 1 },
      extratime: { home: null, away: null },
      penalty: { home: null, away: null },
    },
    description: 'Detailed score information for different periods',
  })
  score: {
    halftime: { home?: number | null; away?: number | null };
    fulltime: { home?: number | null; away?: number | null };
    extratime: { home?: number | null; away?: number | null };
    penalty: { home?: number | null; away?: number | null };
  };

  @ApiProperty({
    example: '2024-03-16T15:00:00.000Z',
    description: 'Creation timestamp',
  })
  createdAt: Date;

  @ApiProperty({
    example: '2024-03-16T15:00:00.000Z',
    description: 'Last update timestamp',
  })
  updatedAt: Date;
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
