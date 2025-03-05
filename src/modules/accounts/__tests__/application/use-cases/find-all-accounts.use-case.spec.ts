import { Test, TestingModule } from '@nestjs/testing';
import { RepositoryInterface } from '@modules/database';
import { FindAllAccountsUseCase } from '../../../application/use-cases';
import { Account } from '../../../domain/entities/account.entity';
import { ACCOUNTS_COLLECTION } from '../../../constants';

describe('FindAllAccountsUseCase', () => {
  let useCase: FindAllAccountsUseCase;
  let repository: RepositoryInterface<Account>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FindAllAccountsUseCase,
        {
          provide: ACCOUNTS_COLLECTION,
          useValue: {
            findAll: jest.fn(),
          },
        },
      ],
    }).compile();

    useCase = module.get<FindAllAccountsUseCase>(FindAllAccountsUseCase);
    repository = module.get<RepositoryInterface<Account>>(ACCOUNTS_COLLECTION);
  });

  it('should be defined', () => {
    expect(useCase).toBeDefined();
  });

  it('should return all accounts', async () => {
    const mockAccounts = [
      new Account({
        id: 'test-id-1',
        email: 'test1@example.com',
        password: 'hashed_password',
        createdAt: new Date(),
        updatedAt: new Date(),
      }),
      new Account({
        id: 'test-id-2',
        email: 'test2@example.com',
        password: 'hashed_password',
        createdAt: new Date(),
        updatedAt: new Date(),
      }),
    ];

    jest.spyOn(repository, 'findAll').mockResolvedValue(mockAccounts);

    const result = await useCase.execute();

    expect(result).toEqual(mockAccounts);
    expect(repository.findAll).toHaveBeenCalled();
  });
});
