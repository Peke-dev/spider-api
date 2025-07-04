import { Test, TestingModule } from '@nestjs/testing';
import { CreateMatchController } from '../../../infrastructure/controllers/create-match.controller';
import { CreateMatchUseCase, UpdateMatchUseCase } from '../../../application';
import { CreateMatchDto } from '../../../application/dto';
import { LeagueRepository } from '@modules/leagues/domain/repositories';
import { MatchShortStatusEnum } from '../../../domain';

describe('CreateMatchController', () => {
  let controller: CreateMatchController;
  let createMatchUseCase: CreateMatchUseCase;
  let leagueRepository: LeagueRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CreateMatchController],
      providers: [
        {
          provide: CreateMatchUseCase,
          useValue: {
            execute: jest.fn(),
          },
        },
        {
          provide: UpdateMatchUseCase,
          useValue: {
            execute: jest.fn(),
          },
        },
        {
          provide: LeagueRepository,
          useValue: {
            findOneById: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<CreateMatchController>(CreateMatchController);
    createMatchUseCase = module.get<CreateMatchUseCase>(CreateMatchUseCase);
    leagueRepository = module.get<LeagueRepository>(LeagueRepository);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create a match successfully', async () => {
      const createMatchDto: CreateMatchDto = {
        id: '123e4567-e89b-12d3-a456-426614174000',
        referee: 'A. Taylor',
        timezone: 'UTC',
        date: '2024-03-16T15:00:00+00:00',
        timestamp: 1710601200,
        periods: {
          first: 45,
          second: 45,
        },
        venue: {
          id: '1',
          name: 'Old Trafford',
          city: 'Manchester',
        },
        status: {
          long: 'Match Finished',
          short: MatchShortStatusEnum.FT,
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
            id: '33',
            name: 'Manchester United',
            logo: 'https://media.api-sports.io/football/teams/33.png',
            winner: true,
          },
          away: {
            id: '34',
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
      };

      const mockLeague = {
        id: '39',
        name: 'Premier League',
        country: 'England',
        logo: 'https://media.api-sports.io/football/leagues/39.png',
        flag: 'https://media.api-sports.io/flags/gb.svg',
        season: 2023,
        round: 'Regular Season - 1',
      };

      const expectedId = 'new-match-id';

      jest
        .spyOn(leagueRepository, 'findOneById')
        .mockResolvedValue(mockLeague as any);
      jest.spyOn(createMatchUseCase, 'execute').mockResolvedValue(expectedId);

      const result = await controller.create(createMatchDto);

      expect(result).toEqual({
        id: expectedId,
        message: 'Match created successfully',
      });
      expect(leagueRepository.findOneById).toHaveBeenCalledWith('39');
      expect(createMatchUseCase.execute).toHaveBeenCalledWith(createMatchDto);
    });
  });
});
