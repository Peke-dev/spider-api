import { Test, TestingModule } from '@nestjs/testing';
import { CreateMatchUseCase } from '../../../application/use-cases';
import { Match } from '../../../domain/entities';
import { MATCHES_COLLECTION } from '../../../constants';
import { RepositoryInterface } from '@modules/database';

describe('CreateMatchUseCase', () => {
  let useCase: CreateMatchUseCase;
  let repository: RepositoryInterface<Match>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CreateMatchUseCase,
        {
          provide: MATCHES_COLLECTION,
          useValue: {
            create: jest.fn(),
          },
        },
      ],
    }).compile();

    useCase = module.get<CreateMatchUseCase>(CreateMatchUseCase);
    repository = module.get<RepositoryInterface<Match>>(MATCHES_COLLECTION);
  });

  it('should be defined', () => {
    expect(useCase).toBeDefined();
  });

  describe('execute', () => {
    it('should create a match successfully', async () => {
      const matchData: Partial<Match> = {
        referee: 'A. Taylor',
        timezone: 'UTC',
        date: '2024-03-16T15:00:00+00:00',
        timestamp: 1710601200,
        periods: {
          first: 45,
          second: 45,
        },
        venue: {
          id: 1,
          name: 'Old Trafford',
          city: 'Manchester',
        },
        status: {
          long: 'Match Finished',
          short: 'FT',
          elapsed: 90,
        },
        league: {
          id: 39,
          name: 'Premier League',
          country: 'England',
          logo: 'https://media.api-sports.io/football/leagues/39.png',
          season: 2023,
          round: 'Regular Season - 1',
        },
        teams: {
          home: {
            id: 33,
            name: 'Manchester United',
            logo: 'https://media.api-sports.io/football/teams/33.png',
            winner: true,
          },
          away: {
            id: 34,
            name: 'Newcastle',
            logo: 'https://media.api-sports.io/football/teams/34.png',
            winner: false,
          },
        },
        goals: {
          home: 2,
          away: 1,
        },
        score: {
          halftime: {
            home: 1,
            away: 0,
          },
          fulltime: {
            home: 2,
            away: 1,
          },
          extratime: {
            home: null,
            away: null,
          },
          penalty: {
            home: null,
            away: null,
          },
        },
      };

      jest.spyOn(repository, 'create').mockResolvedValue('match-1');

      const result = await useCase.execute(matchData);

      expect(result).toBe('match-1');
      expect(repository.create).toHaveBeenCalledWith(matchData);
    });

    it('should handle repository errors', async () => {
      const matchData: Partial<Match> = {
        referee: 'A. Taylor',
        timezone: 'UTC',
      };

      jest
        .spyOn(repository, 'create')
        .mockRejectedValue(new Error('Database error'));

      await expect(useCase.execute(matchData)).rejects.toThrow(
        'Database error',
      );
    });
  });
});
