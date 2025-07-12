import { ApiProperty } from '@nestjs/swagger';
import { Match } from '../../domain';
import { MatchEvent } from '@modules/matches/domain/entities/match-event.entity';

const uuidField = {
  example: '123e4567-e89b-12d3-a456-426614174000',
  description: 'Unique identifier of the match',
};

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

export class MatchResponseDto implements Partial<Match> {
  @ApiProperty(uuidField)
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
    id?: string | null;
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
      id: string;
      name: string;
      logo: string;
      winner: boolean;
    };
    away: {
      id: string;
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
    home: number;
    away: number;
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

export class MatchEventResponseDto implements MatchEvent {
  @ApiProperty(uuidField)
  matchId: string;
  @ApiProperty(uuidField)
  id: string;

  @ApiProperty({
    example: { elapsed: 10, extra: null },
    description: 'Time of the match event',
  })
  time: {
    elapsed: number;
    extra: number | null;
  };

  @ApiProperty({
    example: { id: 1, name: 'Team 1', logo: 'https://example.com/logo.png' },
    description: 'Team of the match event',
  })
  team: {
    id: string;
    name: string;
    logo: string;
  };

  @ApiProperty({
    example: { id: '123e4567-e89b-12d3-a456-426614174000', name: 'Player 1' },
    description: 'Player of the match event',
  })
  player: {
    id: string | null;
    name: string | null;
  };

  @ApiProperty({
    example: { id: '123e4567-e89b-12d3-a456-426614174000', name: 'Assist 1' },
    description: 'Assist of the match event',
  })
  assist: {
    id: string | null;
    name: string | null;
  };

  @ApiProperty({
    example: 'goal',
    description: 'Type of the match event',
  })
  type: string;

  @ApiProperty({
    example: 'Goal scored by Player 1',
    description: 'Detail of the match event',
  })
  detail: string;

  @ApiProperty({
    example: 'Great goal by Player 1',
    description: 'Comments of the match event',
  })
  comments: string | null;

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
