import { Test, TestingModule } from '@nestjs/testing';
import { UpdateLeagueController } from '../../../infrastructure/controllers/update-league.controller';
import { UpdateLeagueUseCase } from '../../../application/use-cases/update-league.use-case';
import { LeagueStatusEnum } from '../../../domain';
import {
  UpdateLeagueDto,
  UpdateLeagueResponseDto,
} from '../../../application/dto';
import { plainToClass } from 'class-transformer';
import { validate } from 'class-validator';

describe('UpdateLeagueController', () => {
  let controller: UpdateLeagueController;

  const updateLeagueUseCaseMock = {
    execute: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UpdateLeagueController],
      providers: [
        {
          provide: UpdateLeagueUseCase,
          useValue: updateLeagueUseCaseMock,
        },
      ],
    }).compile();

    controller = module.get<UpdateLeagueController>(UpdateLeagueController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('update', () => {
    it('should update a league successfully with valid response structure', async () => {
      const updateLeagueDto: UpdateLeagueDto = {
        name: 'Updated Premier League',
        logo: 'https://media.api-sports.io/football/leagues/39-updated.png',
        status: LeagueStatusEnum.ENABLED,
        seasons: [
          {
            year: 2024,
            start: '2024-08-10',
            end: '2025-05-18',
            current: true,
          },
        ],
      };

      updateLeagueUseCaseMock.execute.mockResolvedValue(undefined);

      const result = await controller.update(
        '123e4567-e89b-12d3-a456-426614174000',
        updateLeagueDto,
      );

      // Validar que la respuesta coincida con el DTO
      const validatedResponse = plainToClass(UpdateLeagueResponseDto, result);
      const errors = await validate(validatedResponse);

      expect(errors).toHaveLength(0);
      expect(result).toEqual({ message: 'League updated successfully' });
      expect(updateLeagueUseCaseMock.execute).toHaveBeenCalledWith(
        '123e4567-e89b-12d3-a456-426614174000',
        updateLeagueDto,
      );
    });
  });
});
