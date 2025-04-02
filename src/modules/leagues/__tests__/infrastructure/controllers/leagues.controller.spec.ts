import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { LeaguesController } from '../../../infrastructure/controllers';
import {
  CreateLeagueUseCase,
  FindLeagueByIdUseCase,
  FindAllLeaguesUseCase,
} from '../../../application/use-cases';
import { LeagueTypeEnum } from '../../../domain';
import { CreateLeagueDto } from '../../../infrastructure/dto';
import { createMockLeague } from '../../../__tests__/__mocks__/league.mock';

describe('LeaguesController', () => {
  let controller: LeaguesController;
  let createLeagueUseCase: CreateLeagueUseCase;
  let findLeagueByIdUseCase: FindLeagueByIdUseCase;
  let findAllLeaguesUseCase: FindAllLeaguesUseCase;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [LeaguesController],
      providers: [
        {
          provide: CreateLeagueUseCase,
          useValue: {
            execute: jest.fn(),
          },
        },
        {
          provide: FindLeagueByIdUseCase,
          useValue: {
            execute: jest.fn(),
          },
        },
        {
          provide: FindAllLeaguesUseCase,
          useValue: {
            execute: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<LeaguesController>(LeaguesController);
    createLeagueUseCase = module.get<CreateLeagueUseCase>(CreateLeagueUseCase);
    findLeagueByIdUseCase = module.get<FindLeagueByIdUseCase>(
      FindLeagueByIdUseCase,
    );
    findAllLeaguesUseCase = module.get<FindAllLeaguesUseCase>(
      FindAllLeaguesUseCase,
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create a league successfully with valid data', async () => {
      const createLeagueDto: CreateLeagueDto = {
        name: 'Premier League',
        country: 'England',
        logo: 'https://media.api-sports.io/football/leagues/39.png',
        type: LeagueTypeEnum.LEAGUE,
        seasons: [
          {
            year: 2023,
            start: '2023-08-11',
            end: '2024-05-19',
            current: true,
          },
        ],
      };

      jest.spyOn(createLeagueUseCase, 'execute').mockResolvedValue('39');

      const result = await controller.create(createLeagueDto);

      expect(result).toEqual({ id: '39' });
      expect(createLeagueUseCase.execute).toHaveBeenCalledWith(createLeagueDto);
    });
  });

  describe('findAll', () => {
    it('should return all leagues', async () => {
      const mockLeagues = [createMockLeague()];

      jest
        .spyOn(findAllLeaguesUseCase, 'execute')
        .mockResolvedValue(mockLeagues);

      const result = await controller.findAll();

      expect(result).toEqual(mockLeagues);
      expect(findAllLeaguesUseCase.execute).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should return a league by id', async () => {
      const mockLeague = createMockLeague({ id: '39' });

      jest
        .spyOn(findLeagueByIdUseCase, 'execute')
        .mockResolvedValue(mockLeague);

      const result = await controller.findOne('39');

      expect(result).toEqual(mockLeague);
      expect(findLeagueByIdUseCase.execute).toHaveBeenCalledWith('39');
    });

    it('should handle NotFoundException', async () => {
      jest
        .spyOn(findLeagueByIdUseCase, 'execute')
        .mockRejectedValue(new NotFoundException('League not found'));

      await expect(controller.findOne('999')).rejects.toThrow(
        NotFoundException,
      );
    });
  });
});
