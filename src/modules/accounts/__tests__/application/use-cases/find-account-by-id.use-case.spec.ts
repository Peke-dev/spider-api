import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { RepositoryInterface } from '@modules/database';
import { FindAccountByIdUseCase } from '../../../application/use-cases';
import { Account } from '../../../domain/entities/account.entity';
import { ACCOUNTS_COLLECTION } from '../../../constants';

describe('FindAccountByIdUseCase', () => {
  let useCase: FindAccountByIdUseCase;
  let repository: RepositoryInterface<Account>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FindAccountByIdUseCase,
        {
          provide: ACCOUNTS_COLLECTION,
          useValue: {
            findOneById: jest.fn(),
          },
        },
      ],
    }).compile();

    useCase = module.get<FindAccountByIdUseCase>(FindAccountByIdUseCase);
    repository = module.get<RepositoryInterface<Account>>(ACCOUNTS_COLLECTION);
  });

  it('should be defined', () => {
    expect(useCase).toBeDefined();
  });

  it('should find account by id successfully', async () => {
    const mockAccount = new Account({
      id: 'test-id',
      email: 'test@example.com',
      password: 'hashed_password',
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    jest.spyOn(repository, 'findOneById').mockResolvedValue(mockAccount);

    const result = await useCase.execute('test-id');

    expect(result).toEqual(mockAccount);
    expect(repository.findOneById).toHaveBeenCalledWith('test-id');
  });

  it('should throw NotFoundException when account is not found', async () => {
    jest.spyOn(repository, 'findOneById').mockResolvedValue(null);

    await expect(useCase.execute('non-existent-id')).rejects.toThrow(
      NotFoundException,
    );
  });
});
