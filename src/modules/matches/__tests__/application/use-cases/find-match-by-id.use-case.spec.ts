import { Test, TestingModule } from '@nestjs/testing';
import { RepositoryInterface } from '@modules/database';
import { FindMatchByIdUseCase } from '../../../application/use-cases';
import { Match } from '../../../domain/entities';
import { MATCHES_COLLECTION } from '../../../constants';

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

  it('should find match by id successfully', async () => {
    const mockMatch = new Match({
      id: 'test-id',
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
        flag: 'https://media.api-sports.io/flags/gb.svg',
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
        halftime: { home: 1, away: 0 },
        fulltime: { home: 2, away: 1 },
        extratime: { home: null, away: null },
        penalty: { home: null, away: null },
      },
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    jest.spyOn(repository, 'findOneById').mockResolvedValue(mockMatch);

    const result = await useCase.execute('test-id');

    expect(result).toEqual(mockMatch);
    expect(repository.findOneById).toHaveBeenCalledWith('test-id');
  });

  it('should return null when match is not found', async () => {
    jest.spyOn(repository, 'findOneById').mockResolvedValue(null);

    const result = await useCase.execute('non-existent-id');

    expect(result).toBeNull();
    expect(repository.findOneById).toHaveBeenCalledWith('non-existent-id');
  });
});
