import { Test, TestingModule } from '@nestjs/testing';
import { RepositoryInterface } from '@modules/database';
import { CreateLeagueUseCase } from '../../../application';
import { League } from '../../../domain/';
import { LEAGUES_COLLECTION } from '../../../constants';

describe('CreateLeagueUseCase', () => {
  let useCase: CreateLeagueUseCase;
  let repository: RepositoryInterface<League>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CreateLeagueUseCase,
        {
          provide: LEAGUES_COLLECTION,
          useValue: {
            create: jest.fn(),
          },
        },
      ],
    }).compile();

    useCase = module.get<CreateLeagueUseCase>(CreateLeagueUseCase);
    repository = module.get<RepositoryInterface<League>>(LEAGUES_COLLECTION);
  });

  it('should be defined', () => {
    expect(useCase).toBeDefined();
  });

  it('should create a league successfully', async () => {
    const createLeagueDto = {
      name: 'Premier League',
      country: 'England',
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
    };

    jest.spyOn(repository, 'create').mockResolvedValue('league-1'); // Cambiado a string

    const result = await useCase.execute(createLeagueDto);

    expect(result).toBe('league-1');
    expect(repository.create).toHaveBeenCalledWith(
      expect.objectContaining({
        name: createLeagueDto.name,
        country: expect.objectContaining({
          name: createLeagueDto.country,
          code: null,
          flag: null,
        }),
        logo: createLeagueDto.logo,
        type: createLeagueDto.type,
        round: createLeagueDto.round,
        seasons: expect.arrayContaining([
          expect.objectContaining({
            year: 2023,
            start: '2023-08-11',
            end: '2024-05-19',
            current: true,
          }),
        ]),
        id: expect.any(String),
        createdAt: expect.any(Date),
        updatedAt: expect.any(Date),
      }),
    );
  });

  it('should handle repository errors', async () => {
    const createLeagueDto = {
      name: 'Premier League',
      country: 'England',
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
    };

    const error = new Error('Database error');
    jest.spyOn(repository, 'create').mockRejectedValue(error);

    await expect(useCase.execute(createLeagueDto)).rejects.toThrow(error);
  });
});
