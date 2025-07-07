import { Test, TestingModule } from '@nestjs/testing';
import { FindAllMatchesController } from '../../../infrastructure/controllers/find-all-matches.controller';
import { FindAllMatchesUseCase } from '../../../application';
import { Match } from '../../../domain/entities';
import { FindMatchesQueryDto } from '../../../application/dto';

describe('FindAllMatchesController', () => {
  let controller: FindAllMatchesController;

  const findAllMatchesUseCaseMock = {
    execute: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FindAllMatchesController],
      providers: [
        {
          provide: FindAllMatchesUseCase,
          useValue: findAllMatchesUseCaseMock,
        },
      ],
    }).compile();

    controller = module.get<FindAllMatchesController>(FindAllMatchesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('findAll', () => {
    it('should return all matches', async () => {
      const mockMatches: Match[] = [
        new Match({
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
            id: '39',
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
        }),
      ];

      const query: FindMatchesQueryDto = {};

      findAllMatchesUseCaseMock.execute.mockResolvedValue(mockMatches);

      const result = await controller.findAll(query);

      expect(result).toEqual(mockMatches);
      expect(findAllMatchesUseCaseMock.execute).toHaveBeenCalledWith(query);
    });
  });
});
