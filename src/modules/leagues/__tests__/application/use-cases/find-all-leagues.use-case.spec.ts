import { RepositoryInterface } from '@modules/database';
import { FindAllLeaguesUseCase } from '../../../application';
import { League } from '../../../domain/entities/league.entity';
import { createMockLeagues } from '../../../__tests__/__mocks__/league.mock';

describe('FindAllLeaguesUseCase', () => {
  let useCase: FindAllLeaguesUseCase;
  let repository: RepositoryInterface<League>;

  beforeEach(() => {
    repository = {
      findAll: jest.fn(),
      findOneById: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      findOneBy: jest.fn(),
    } as RepositoryInterface<League>;

    useCase = new FindAllLeaguesUseCase(repository);
  });

  it('should be defined', () => {
    expect(useCase).toBeDefined();
  });

  it('should return all leagues', async () => {
    const mockLeagues = createMockLeagues(3);
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
