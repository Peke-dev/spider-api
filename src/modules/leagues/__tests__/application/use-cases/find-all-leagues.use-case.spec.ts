import { Test, TestingModule } from '@nestjs/testing';
import { RepositoryInterface } from '@modules/database';
import { FindAllLeaguesUseCase } from '../../../application';
import { League } from '../../../domain/entities/league.entity';
import { LEAGUES_COLLECTION } from '../../../constants';

describe('FindAllLeaguesUseCase', () => {
  let useCase: FindAllLeaguesUseCase;
  let repository: RepositoryInterface<League>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FindAllLeaguesUseCase,
        {
          provide: LEAGUES_COLLECTION,
          useValue: {
            findAll: jest.fn(),
          },
        },
      ],
    }).compile();

    useCase = module.get<FindAllLeaguesUseCase>(FindAllLeaguesUseCase);
    repository = module.get<RepositoryInterface<League>>(LEAGUES_COLLECTION);
  });

  it('should be defined', () => {
    expect(useCase).toBeDefined();
  });

  it('should return all leagues', async () => {
    const mockLeagues = [
      new League({
        id: '39',
        name: 'Premier League',
        country: {
          name: 'England',
          code: 'GB',
          flag: 'https://media.api-sports.io/flags/gb.svg',
        },
        logo: 'https://media.api-sports.io/football/leagues/39.png',
        type: 'League',
        round: 'Regular Season',
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
      }),
    ];

    jest.spyOn(repository, 'findAll').mockResolvedValue(mockLeagues);

    const result = await useCase.execute();

    expect(result).toEqual(mockLeagues);
    expect(repository.findAll).toHaveBeenCalled();
  });

  it('should return empty array when no leagues found', async () => {
    jest.spyOn(repository, 'findAll').mockResolvedValue([]);

    const result = await useCase.execute();

    expect(result).toEqual([]);
    expect(repository.findAll).toHaveBeenCalled();
  });

  it('should handle repository errors', async () => {
    const error = new Error('Database error');
    jest.spyOn(repository, 'findAll').mockRejectedValue(error);

    await expect(useCase.execute()).rejects.toThrow(error);
    expect(repository.findAll).toHaveBeenCalled();
  });
});
