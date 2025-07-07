import { Test, TestingModule } from '@nestjs/testing';
import { CreateMatchController } from '../../../infrastructure/controllers/create-match.controller';
import { CreateMatchUseCase } from '../../../application';
import { Match, MatchShortStatusEnum } from '../../../domain';
import { CreateMatchDto } from '../../../application/dto';

describe('CreateMatchController', () => {
  let controller: CreateMatchController;

  const createMatchUseCaseMock = {
    execute: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CreateMatchController],
      providers: [
        {
          provide: CreateMatchUseCase,
          useValue: createMatchUseCaseMock,
        },
      ],
    }).compile();

    controller = module.get<CreateMatchController>(CreateMatchController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create a match successfully', async () => {
      const createMatchDto: CreateMatchDto = {
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
          id: '123e4567-e89b-12d3-a456-426614174000',
          name: 'Old Trafford',
          city: 'Manchester',
        },
        status: {
          long: 'Match Finished',
          short: MatchShortStatusEnum.FT,
          elapsed: 90,
        },
        league: {
          id: '123e4567-e89b-12d3-a456-426614174001',
          name: 'Premier League',
          country: 'England',
          logo: 'https://media.api-sports.io/football/leagues/39.png',
          flag: 'https://media.api-sports.io/flags/gb.svg',
          season: 2023,
          round: 'Regular Season - 1',
        },
        teams: {
          home: {
            id: '123e4567-e89b-12d3-a456-426614174002',
            name: 'Manchester United',
            logo: 'https://media.api-sports.io/football/teams/33.png',
            winner: true,
          },
          away: {
            id: '123e4567-e89b-12d3-a456-426614174003',
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

      const mockMatch = new Match({
        ...createMatchDto,
        venue: {
          ...createMatchDto.venue,
          id: 1, // Convert string to number for entity
        },
        league: {
          ...createMatchDto.league,
          id: '39', // Keep as string for entity
        },
        teams: {
          home: {
            ...createMatchDto.teams.home,
            id: 33, // Convert string to number for entity
          },
          away: {
            ...createMatchDto.teams.away,
            id: 34, // Convert string to number for entity
          },
        },
        goals: {
          home: createMatchDto.goals.home || null,
          away: createMatchDto.goals.away || null,
        },
      });

      createMatchUseCaseMock.execute.mockResolvedValue(mockMatch);

      const result = await controller.create(createMatchDto);

      expect(result).toEqual(mockMatch);
      expect(createMatchUseCaseMock.execute).toHaveBeenCalledWith(
        createMatchDto,
      );
    });
  });
});
