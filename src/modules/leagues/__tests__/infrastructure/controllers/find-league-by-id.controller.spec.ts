import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { FindLeagueByIdController } from '../../../infrastructure/controllers/find-league-by-id.controller';
import { FindLeagueByIdUseCase } from '../../../application/use-cases/find-league-by-id.use-case';
import { LeagueResponseDto } from '../../../application/dto';
import { createMockLeague } from '../../../__tests__/__mocks__/league.mock';
import { plainToClass } from 'class-transformer';
import { validate } from 'class-validator';

describe('FindLeagueByIdController', () => {
  let controller: FindLeagueByIdController;

  const findLeagueByIdUseCaseMock = {
    execute: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FindLeagueByIdController],
      providers: [
        {
          provide: FindLeagueByIdUseCase,
          useValue: findLeagueByIdUseCaseMock,
        },
      ],
    }).compile();

    controller = module.get<FindLeagueByIdController>(FindLeagueByIdController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('findOne', () => {
    it('should return a league by id with valid response structure', async () => {
      const mockLeague = createMockLeague({
        id: '123e4567-e89b-12d3-a456-426614174000',
      });

      findLeagueByIdUseCaseMock.execute.mockResolvedValue(mockLeague);

      const result = await controller.findOne(
        '123e4567-e89b-12d3-a456-426614174000',
      );

      // Validar que la respuesta coincida con el DTO
      const validatedResponse = plainToClass(LeagueResponseDto, result);
      const errors = await validate(validatedResponse);

      expect(errors).toHaveLength(0);
      expect(result).toEqual(mockLeague);
      expect(findLeagueByIdUseCaseMock.execute).toHaveBeenCalledWith(
        '123e4567-e89b-12d3-a456-426614174000',
      );
    });

    it('should handle NotFoundException', async () => {
      findLeagueByIdUseCaseMock.execute.mockRejectedValue(
        new NotFoundException('League not found'),
      );

      await expect(controller.findOne('999')).rejects.toThrow(
        NotFoundException,
      );
    });
  });
});
