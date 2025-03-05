import { Test, TestingModule } from '@nestjs/testing';
import { RepositoryInterface } from '@modules/database';
import { FindAccountByUseCase } from '../../../application/use-cases';
import { Account } from '../../../domain/entities/account.entity';
import { ACCOUNTS_COLLECTION } from '../../../constants';

describe('FindAccountByUseCase', () => {
  let useCase: FindAccountByUseCase;
  let repository: RepositoryInterface<Account>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FindAccountByUseCase,
        {
          provide: ACCOUNTS_COLLECTION,
          useValue: {
            findOneBy: jest.fn(),
          },
        },
      ],
    }).compile();

    useCase = module.get<FindAccountByUseCase>(FindAccountByUseCase);
    repository = module.get<RepositoryInterface<Account>>(ACCOUNTS_COLLECTION);
  });

  it('should be defined', () => {
    expect(useCase).toBeDefined();
  });

  it('should find account by email successfully', async () => {
    const mockAccount = new Account({
      id: 'test-id',
      email: 'test@example.com',
      password: 'hashed_password',
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    jest.spyOn(repository, 'findOneBy').mockResolvedValue(mockAccount);

    const result = await useCase.execute('email', 'test@example.com');

    expect(result).toEqual(mockAccount);
    expect(repository.findOneBy).toHaveBeenCalledWith(
      'email',
      'test@example.com',
    );
  });

  it('should return null when no account is found', async () => {
    jest.spyOn(repository, 'findOneBy').mockResolvedValue(null);

    const result = await useCase.execute('email', 'nonexistent@example.com');

    expect(result).toBeNull();
    expect(repository.findOneBy).toHaveBeenCalledWith(
      'email',
      'nonexistent@example.com',
    );
  });

  it('should find account by id successfully', async () => {
    const mockAccount = new Account({
      id: 'test-id',
      email: 'test@example.com',
      password: 'hashed_password',
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    jest.spyOn(repository, 'findOneBy').mockResolvedValue(mockAccount);

    const result = await useCase.execute('id', 'test-id');

    expect(result).toEqual(mockAccount);
    expect(repository.findOneBy).toHaveBeenCalledWith('id', 'test-id');
  });

  it('should handle repository errors', async () => {
    const error = new Error('Database error');
    jest.spyOn(repository, 'findOneBy').mockRejectedValue(error);

    await expect(useCase.execute('email', 'test@example.com')).rejects.toThrow(
      error,
    );
    expect(repository.findOneBy).toHaveBeenCalledWith(
      'email',
      'test@example.com',
    );
  });
});
