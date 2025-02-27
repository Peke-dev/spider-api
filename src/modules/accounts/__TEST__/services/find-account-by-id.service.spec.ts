import { Test, TestingModule } from '@nestjs/testing';

import { Account, ACCOUNTS_COLLECTION } from '@modules/accounts';
import { repositoryMock } from '@modules/database/__TEST__/__MOCK__';

import { FindAccountByIdService } from '../../services';

describe('FindAccountByIdService', () => {
  let service: FindAccountByIdService;

  const accountRepositoryMock = repositoryMock;

  const mockAccount = {
    id: '1',
    user: 'testUser',
    email: 'test@example.com',
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FindAccountByIdService,
        {
          provide: ACCOUNTS_COLLECTION,
          useValue: accountRepositoryMock,
        },
      ],
    }).compile();

    service = module.get(FindAccountByIdService);
  });

  describe('When run method is called a valid account id', () => {
    let result: Account | null;

    beforeAll(async () => {
      accountRepositoryMock.findOneById.mockResolvedValueOnce(mockAccount);
      result = await service.run('1');
    });

    it('should return an account when found', () => {
      expect(result).toEqual(mockAccount);
    });

    it('should call the repository with the correct id', () => {
      expect(accountRepositoryMock.findOneById).toHaveBeenCalledWith('1');
    });
  });

  describe('When run method is called a invalid account id', () => {
    it('should return null when account not found', async () => {
      accountRepositoryMock.findOneById.mockResolvedValueOnce(null);

      const result = await service.run('1');

      expect(result).toBeNull();
    });
  });
});
