import { RepositoryInterface } from '@modules/database';
import { CreateLeagueUseCase } from '../../../application';
import { League } from '../../../domain/entities/league.entity';
import { CreateLeagueDto } from '../../../application/dto';
import { LeagueTypeEnum } from '../../../domain/enums/league.enum';

describe('CreateLeagueUseCase', () => {
  let useCase: CreateLeagueUseCase;
  let repository: RepositoryInterface<League>;

  beforeEach(() => {
    repository = {
      findAll: jest.fn(),
      findOneById: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      findOneBy: jest.fn(),
    } as RepositoryInterface<League>;

    useCase = new CreateLeagueUseCase(repository);
  });

  it('should be defined', () => {
    expect(useCase).toBeDefined();
  });

  it('should create a league successfully', async () => {
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

    jest.spyOn(repository, 'create').mockResolvedValue('39');

    const result = await useCase.execute(createLeagueDto);

    expect(result).toBe('39');
    expect(repository.create).toHaveBeenCalledWith(createLeagueDto);
  });

  it('should handle repository errors', async () => {
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

    const error = new Error('Database error');
    jest.spyOn(repository, 'create').mockRejectedValue(error);

    await expect(useCase.execute(createLeagueDto)).rejects.toThrow(error);
    expect(repository.create).toHaveBeenCalledWith(createLeagueDto);
  });
});
