import { Test, TestingModule } from '@nestjs/testing';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { NotFoundException } from '@nestjs/common';
import { UpdateMatchUseCase } from '../../../application/use-cases/update-match.use-case';
import { MatchRepository } from '../../../domain/repositories';
import { UpdateMatchDto } from '../../../application/dto';
import { MATCH_EVENTS, MatchShortStatusEnum } from '../../../domain';

describe('UpdateMatchUseCase', () => {
  let useCase: UpdateMatchUseCase;
  let repository: jest.Mocked<MatchRepository>;
  let eventEmitter: jest.Mocked<EventEmitter2>;

  const mockMatch = {
    id: 'test-match-id',
    timezone: 'UTC',
    date: '2024-03-16T15:00:00+00:00',
    timestamp: 1710601200,
    periods: { first: 45, second: 45 },
    venue: { id: 1, name: 'Stadium', city: 'City' },
    status: { long: 'Match Finished', short: 'FT', elapsed: 90 },
    league: {
      id: '1',
      name: 'League',
      country: 'Country',
      logo: 'logo.png',
      season: 2024,
      round: 'Round 1',
    },
    teams: {
      home: { id: 1, name: 'Team A', logo: 'logo.png', winner: true },
      away: { id: 2, name: 'Team B', logo: 'logo.png', winner: false },
    },
    goals: { home: 2, away: 1 },
    score: {
      halftime: { home: 1, away: 0 },
      fulltime: { home: 2, away: 1 },
      extratime: { home: null, away: null },
      penalty: { home: null, away: null },
    },
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UpdateMatchUseCase,
        {
          provide: MatchRepository,
          useValue: {
            findOneById: jest.fn(),
            update: jest.fn(),
          },
        },
        {
          provide: EventEmitter2,
          useValue: {
            emit: jest.fn(),
          },
        },
      ],
    }).compile();

    useCase = module.get<UpdateMatchUseCase>(UpdateMatchUseCase);
    repository = module.get(MatchRepository);
    eventEmitter = module.get(EventEmitter2);
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(useCase).toBeDefined();
  });

  describe('execute', () => {
    it('should update match and emit event successfully', async () => {
      const matchId = 'test-match-id';
      const updateDto: UpdateMatchDto = {
        referee: 'Updated Referee',
        timezone: 'UTC',
      };

      repository.findOneById.mockResolvedValueOnce(mockMatch);
      repository.update.mockResolvedValueOnce('updated');

      const result = await useCase.execute(matchId, updateDto);

      expect(result).toBe('updated');
      expect(repository.findOneById).toHaveBeenCalledWith(matchId);
      expect(repository.update).toHaveBeenCalledWith(matchId, {
        ...updateDto,
        updatedAt: expect.any(Date),
      });
      expect(eventEmitter.emit).toHaveBeenCalledWith(
        MATCH_EVENTS.MATCH_UPDATED,
        {
          matchId,
        },
      );
    });

    it('should throw NotFoundException when match not found', async () => {
      const matchId = 'non-existent-id';
      const updateDto: UpdateMatchDto = {
        referee: 'Updated Referee',
      };

      repository.findOneById.mockResolvedValueOnce(null);

      await expect(useCase.execute(matchId, updateDto)).rejects.toThrow(
        NotFoundException,
      );

      expect(repository.findOneById).toHaveBeenCalledWith(matchId);
      expect(repository.update).not.toHaveBeenCalled();
      expect(eventEmitter.emit).not.toHaveBeenCalled();
    });

    it('should handle status with type mapping', async () => {
      const matchId = 'test-match-id';
      const updateDto: UpdateMatchDto = {
        status: { short: MatchShortStatusEnum.HT },
      };

      repository.findOneById.mockResolvedValue(mockMatch);
      repository.update.mockResolvedValue('updated');

      const result = await useCase.execute(matchId, updateDto);

      expect(result).toBe('updated');
      expect(repository.update).toHaveBeenCalledWith(matchId, {
        ...updateDto,
        status: {
          short: MatchShortStatusEnum.HT,
          type: expect.any(String),
        },
        updatedAt: expect.any(Date),
      });
      expect(eventEmitter.emit).toHaveBeenCalledWith(
        MATCH_EVENTS.MATCH_UPDATED,
        {
          matchId,
        },
      );
    });

    it('should return match id when no differences are found', async () => {
      repository.findOneById.mockResolvedValueOnce(mockMatch);

      const result = await useCase.execute(
        mockMatch.id,
        mockMatch as unknown as UpdateMatchDto,
      );

      expect(result).toBe(mockMatch.id);
      expect(repository.findOneById).toHaveBeenCalledWith(mockMatch.id);
      expect(repository.update).not.toHaveBeenCalled();
      expect(eventEmitter.emit).not.toHaveBeenCalled();
    });
  });
});
