import { Test, TestingModule } from '@nestjs/testing';
import { FindAllLeaguesController } from '../../../infrastructure/controllers/find-all-leagues.controller';
import { FindAllLeaguesUseCase } from '../../../application/use-cases/find-all-leagues.use-case';
import { LeagueResponseDto } from '../../../application/dto';
import { createMockLeague } from '../../../__tests__/__mocks__/league.mock';
import { plainToClass } from 'class-transformer';
import { validate } from 'class-validator';

describe('FindAllLeaguesController', () => {
  let controller: FindAllLeaguesController;

  const findAllLeaguesUseCaseMock = {
    execute: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FindAllLeaguesController],
      providers: [
        {
          provide: FindAllLeaguesUseCase,
          useValue: findAllLeaguesUseCaseMock,
        },
      ],
    }).compile();

    controller = module.get<FindAllLeaguesController>(FindAllLeaguesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('findAll', () => {
    it('should return all leagues with valid response structure', async () => {
      const mockLeagues = [createMockLeague()];

      findAllLeaguesUseCaseMock.execute.mockResolvedValue(mockLeagues);

      const result = await controller.findAll();

      // Validar que cada elemento de la respuesta coincida con el DTO
      for (const league of result) {
        const validatedLeague = plainToClass(LeagueResponseDto, league);
        const errors = await validate(validatedLeague);
        expect(errors).toHaveLength(0);
      }

      expect(result).toEqual(mockLeagues);
      expect(findAllLeaguesUseCaseMock.execute).toHaveBeenCalledWith({
        status: 'enabled',
      });
    });
  });
});
