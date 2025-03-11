import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { FindMatchByIdController } from '../../../infrastructure/controllers/find-match-by-id.controller';
import { FindMatchByIdUseCase } from '../../../application';
import { Match } from '../../../domain/entities';

describe('FindMatchByIdController', () => {
  let controller: FindMatchByIdController;
  let findMatchByIdUseCase: FindMatchByIdUseCase;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FindMatchByIdController],
      providers: [
        {
          provide: FindMatchByIdUseCase,
          useValue: {
            execute: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<FindMatchByIdController>(FindMatchByIdController);
    findMatchByIdUseCase =
      module.get<FindMatchByIdUseCase>(FindMatchByIdUseCase);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
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

      jest.spyOn(findMatchByIdUseCase, 'execute').mockResolvedValue(mockMatch);

      const result = await controller.findOne('match-1');

      expect(result).toEqual(mockMatch);
      expect(findMatchByIdUseCase.execute).toHaveBeenCalledWith('match-1');
    });

    it('should throw NotFoundException when match is not found', async () => {
      jest.spyOn(findMatchByIdUseCase, 'execute').mockResolvedValue(null);

      await expect(controller.findOne('non-existent-id')).rejects.toThrow(
        new NotFoundException('Match with ID non-existent-id not found'),
      );

      expect(findMatchByIdUseCase.execute).toHaveBeenCalledWith(
        'non-existent-id',
      );
    });
  });
});
