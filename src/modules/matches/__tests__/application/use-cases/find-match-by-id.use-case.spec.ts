import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { FindMatchByIdUseCase } from '../../../application/use-cases';
import { Match } from '../../../domain/entities';
import { MATCHES_COLLECTION } from '../../../constants';
import { RepositoryInterface } from '@modules/database';

describe('FindMatchByIdUseCase', () => {
  let useCase: FindMatchByIdUseCase;
  let repository: RepositoryInterface<Match>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FindMatchByIdUseCase,
        {
          provide: MATCHES_COLLECTION,
          useValue: {
            findOneById: jest.fn(),
          },
        },
      ],
    }).compile();

    useCase = module.get<FindMatchByIdUseCase>(FindMatchByIdUseCase);
    repository = module.get<RepositoryInterface<Match>>(MATCHES_COLLECTION);
  });

  it('should be defined', () => {
    expect(useCase).toBeDefined();
  });

  describe('execute', () => {
    it('should find a match by id successfully', async () => {
      const mockMatch = new Match({
        id: 'match-1',
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
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      jest.spyOn(repository, 'findOneById').mockResolvedValue(mockMatch);

      const result = await useCase.execute('match-1');

      expect(result).toEqual(mockMatch);
      expect(repository.findOneById).toHaveBeenCalledWith('match-1');
    });

    it('should throw NotFoundException when match is not found', async () => {
      jest.spyOn(repository, 'findOneById').mockResolvedValue(null);

      await expect(useCase.execute('non-existent')).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should handle repository errors', async () => {
      jest
        .spyOn(repository, 'findOneById')
        .mockRejectedValue(new Error('Database error'));

      await expect(useCase.execute('match-1')).rejects.toThrow(
        'Database error',
      );
    });
  });
});
