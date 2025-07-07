import { Test, TestingModule } from '@nestjs/testing';
import { UpdateMatchController } from '../../../infrastructure/controllers/update-match.controller';
import { UpdateMatchUseCase } from '../../../application';
import { Match, MatchShortStatusEnum } from '../../../domain';
import { UpdateMatchDto } from '../../../application/dto';

describe('UpdateMatchController', () => {
  let controller: UpdateMatchController;

  const updateMatchUseCaseMock = {
    execute: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UpdateMatchController],
      providers: [
        {
          provide: UpdateMatchUseCase,
          useValue: updateMatchUseCaseMock,
        },
      ],
    }).compile();

    controller = module.get<UpdateMatchController>(UpdateMatchController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('update', () => {
    it('should update a match successfully', async () => {
      const updateMatchDto: UpdateMatchDto = {
        referee: 'Updated Referee',
        status: {
          long: 'Match Updated',
          short: MatchShortStatusEnum.FT,
          elapsed: 90,
        },
        goals: {
          home: 3,
          away: 2,
        },
        score: {
          halftime: { home: 1, away: 1 },
          fulltime: { home: 3, away: 2 },
          extratime: { home: undefined, away: undefined },
          penalty: { home: undefined, away: undefined },
        },
      };

      const mockUpdatedMatch = new Match({
        id: 'match-1',
        referee: 'Updated Referee',
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
          long: 'Match Updated',
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
          home: 3,
          away: 2,
        },
        score: {
          halftime: { home: 1, away: 1 },
          fulltime: { home: 3, away: 2 },
          extratime: { home: null, away: null },
          penalty: { home: null, away: null },
        },
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      updateMatchUseCaseMock.execute.mockResolvedValue(mockUpdatedMatch);

      const result = await controller.update('match-1', updateMatchDto);

      expect(result).toEqual(mockUpdatedMatch);
      expect(updateMatchUseCaseMock.execute).toHaveBeenCalledWith(
        'match-1',
        updateMatchDto,
      );
    });
  });
});
