import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { MatchesController } from '../../../infrastructure/controllers';
import {
  CreateMatchUseCase,
  FindMatchByIdUseCase,
  FindAllMatchesUseCase,
} from '../../../application/use-cases';
import { Match } from '../../../domain/entities';
import { CreateMatchDto } from '../../../infrastructure/dto';

describe('MatchesController', () => {
  let controller: MatchesController;
  let createMatchUseCase: CreateMatchUseCase;
  let findMatchByIdUseCase: FindMatchByIdUseCase;
  let findAllMatchesUseCase: FindAllMatchesUseCase;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MatchesController],
      providers: [
        {
          provide: CreateMatchUseCase,
          useValue: {
            execute: jest.fn(),
          },
        },
        {
          provide: FindMatchByIdUseCase,
          useValue: {
            execute: jest.fn(),
          },
        },
        {
          provide: FindAllMatchesUseCase,
          useValue: {
            execute: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<MatchesController>(MatchesController);
    createMatchUseCase = module.get<CreateMatchUseCase>(CreateMatchUseCase);
    findMatchByIdUseCase =
      module.get<FindMatchByIdUseCase>(FindMatchByIdUseCase);
    findAllMatchesUseCase = module.get<FindAllMatchesUseCase>(
      FindAllMatchesUseCase,
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create a match successfully', async () => {
      const createMatchDto: CreateMatchDto = {
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

      jest.spyOn(createMatchUseCase, 'execute').mockResolvedValue('match-1');

      const result = await controller.create(createMatchDto);

      expect(result).toEqual({ id: 'match-1' });
      expect(createMatchUseCase.execute).toHaveBeenCalledWith(createMatchDto);
    });
  });

  describe('findAll', () => {
    it('should return all matches', async () => {
      const mockMatches = [
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
        }),
      ];

      jest
        .spyOn(findAllMatchesUseCase, 'execute')
        .mockResolvedValue(mockMatches);

      const result = await controller.findAll();

      expect(result).toEqual(mockMatches);
      expect(findAllMatchesUseCase.execute).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should return a match by id', async () => {
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

      jest.spyOn(findMatchByIdUseCase, 'execute').mockResolvedValue(mockMatch);

      const result = await controller.findOne('match-1');

      expect(result).toEqual(mockMatch);
      expect(findMatchByIdUseCase.execute).toHaveBeenCalledWith('match-1');
    });

    it('should handle NotFoundException', async () => {
      jest
        .spyOn(findMatchByIdUseCase, 'execute')
        .mockRejectedValue(new NotFoundException('Match not found'));

      await expect(controller.findOne('non-existent')).rejects.toThrow(
        NotFoundException,
      );
    });
  });
});
