import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { RepositoryInterface } from '@modules/database';
import { FindLeagueByIdUseCase } from '../../../application/use-cases';
import { League, LeagueTypeEnum } from '../../../domain';
import { LEAGUES_COLLECTION } from '../../../constants';

describe('FindLeagueByIdUseCase', () => {
  let useCase: FindLeagueByIdUseCase;
  let repository: RepositoryInterface<League>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FindLeagueByIdUseCase,
        {
          provide: LEAGUES_COLLECTION,
          useValue: {
            findOneById: jest.fn(),
          },
        },
      ],
    }).compile();

    useCase = module.get<FindLeagueByIdUseCase>(FindLeagueByIdUseCase);
    repository = module.get<RepositoryInterface<League>>(LEAGUES_COLLECTION);
  });

  it('should be defined', () => {
    expect(useCase).toBeDefined();
  });

  it('should find league by id successfully', async () => {
    const mockLeague = new League({
      id: '39',
      name: 'Premier League',
      country: {
        name: 'England',
        code: 'GB',
        flag: 'https://media.api-sports.io/flags/gb.svg',
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
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    jest.spyOn(repository, 'findOneById').mockResolvedValue(mockLeague);

    const result = await useCase.execute('39');

    expect(result).toEqual(mockLeague);
    expect(repository.findOneById).toHaveBeenCalledWith('39');
  });

  it('should throw NotFoundException when league is not found', async () => {
    jest.spyOn(repository, 'findOneById').mockResolvedValue(null);

    await expect(useCase.execute('999')).rejects.toThrow(NotFoundException);
    expect(repository.findOneById).toHaveBeenCalledWith('999');
  });

  it('should handle repository errors', async () => {
    const error = new Error('Database error');
    jest.spyOn(repository, 'findOneById').mockRejectedValue(error);

    await expect(useCase.execute('39')).rejects.toThrow(error);
    expect(repository.findOneById).toHaveBeenCalledWith('39');
  });
});
