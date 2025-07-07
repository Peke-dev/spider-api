import { Test, TestingModule } from '@nestjs/testing';
import { CreateLeagueController } from '../../../infrastructure/controllers/create-league.controller';
import { CreateLeagueUseCase } from '../../../application/use-cases/create-league.use-case';
import { LeagueTypeEnum } from '../../../domain';
import {
  CreateLeagueDto,
  CreateLeagueResponseDto,
} from '../../../application/dto';
import { plainToClass } from 'class-transformer';
import { validate } from 'class-validator';

describe('CreateLeagueController', () => {
  let controller: CreateLeagueController;

  const createLeagueUseCaseMock = {
    execute: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CreateLeagueController],
      providers: [
        {
          provide: CreateLeagueUseCase,
          useValue: createLeagueUseCaseMock,
        },
      ],
    }).compile();

    controller = module.get<CreateLeagueController>(CreateLeagueController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create a league successfully with valid data', async () => {
      const createLeagueDto: CreateLeagueDto = {
        id: '123e4567-e89b-12d3-a456-426614174000',
        name: 'Premier League',
        country: {
          name: 'England',
          code: 'ENG',
          flag: 'https://media.api-sports.io/flags/eng.svg',
        },
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

      createLeagueUseCaseMock.execute.mockResolvedValue(
        '123e4567-e89b-12d3-a456-426614174000',
      );

      const result = await controller.create(createLeagueDto);

      // Validar que la respuesta coincida con el DTO
      const validatedResponse = plainToClass(CreateLeagueResponseDto, result);
      const errors = await validate(validatedResponse);

      expect(errors).toHaveLength(0);
      expect(result).toEqual({ id: '123e4567-e89b-12d3-a456-426614174000' });
      expect(createLeagueUseCaseMock.execute).toHaveBeenCalledWith(
        createLeagueDto,
      );
    });
  });
});
