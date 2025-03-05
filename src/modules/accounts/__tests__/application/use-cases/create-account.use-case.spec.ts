import { Test, TestingModule } from '@nestjs/testing';
import { RepositoryInterface } from '@modules/database';
import { CreateAccountUseCase } from '../../../application/use-cases';
import { Account } from '../../../domain/entities/account.entity';
import { ACCOUNTS_COLLECTION } from '../../../constants';

describe('CreateAccountUseCase', () => {
  let useCase: CreateAccountUseCase;
  let repository: RepositoryInterface<Account>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CreateAccountUseCase,
        {
          provide: ACCOUNTS_COLLECTION,
          useValue: {
            create: jest.fn(),
            findOneBy: jest.fn(),
          },
        },
      ],
    }).compile();

    useCase = module.get<CreateAccountUseCase>(CreateAccountUseCase);
    repository = module.get<RepositoryInterface<Account>>(ACCOUNTS_COLLECTION);
  });

  it('should be defined', () => {
    expect(useCase).toBeDefined();
  });

  it('should create an account successfully', async () => {
    const createAccountDto = {
      email: 'test@example.com',
      password: 'password123',
    };

    jest.spyOn(repository, 'create').mockResolvedValue('new-account-id');

    const result = await useCase.execute(createAccountDto);

    expect(result).toBe('new-account-id');
    expect(repository.create).toHaveBeenCalledWith(
      expect.objectContaining({
        email: createAccountDto.email,
        id: expect.any(String),
        createdAt: expect.any(Date),
        updatedAt: expect.any(Date),
      }),
    );
  });
});
