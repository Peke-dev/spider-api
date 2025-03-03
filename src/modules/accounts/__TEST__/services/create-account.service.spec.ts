import { Test, TestingModule } from '@nestjs/testing';

import { repositoryMock } from '@modules/database/__TEST__/__MOCK__/repository.mock';
import { ACCOUNTS_COLLECTION } from '@modules/accounts/constants';

import { CreateAccountService } from '../../services/create-account.service';
import { CreateAccountDto } from '@modules/accounts/dto';

describe('CreateAccountService', () => {
  let service: CreateAccountService;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CreateAccountService,
        {
          provide: ACCOUNTS_COLLECTION,
          useValue: repositoryMock,
        },
      ],
    }).compile();

    service = module.get<CreateAccountService>(CreateAccountService);
  });

  it('should create an account', async () => {
    const account: CreateAccountDto = {
      email: 'test@test.com',
      password: 'password',
    };

    await service.run(account);
    expect(repositoryMock.create).toHaveBeenCalled();
  });
});
