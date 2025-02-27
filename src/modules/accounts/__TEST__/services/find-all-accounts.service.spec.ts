import { Test, TestingModule } from '@nestjs/testing';
import { Account, ACCOUNTS_COLLECTION } from '@modules/accounts';
import { repositoryMock } from '@modules/database/__TEST__/__MOCK__';
import { FindAllAccountsService } from '@modules/accounts/services';

describe('FindAllAccountsService', () => {
  let service: FindAllAccountsService;

  const accountRepositoryMock = repositoryMock;

  const mockAccounts = [
    {
      id: '1',
      user: 'testUser1',
      email: 'test1@example.com',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: '2',
      user: 'testUser2',
      email: 'test2@example.com',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ];

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FindAllAccountsService,
        {
          provide: ACCOUNTS_COLLECTION,
          useValue: accountRepositoryMock,
        },
      ],
    }).compile();

    service = module.get(FindAllAccountsService);
  });

  describe('When run method is called', () => {
    let result: Account[];

    beforeAll(async () => {
      accountRepositoryMock.findAll.mockResolvedValueOnce(mockAccounts);
      result = await service.run();
    });

    it('should return an array of accounts', () => {
      expect(result).toEqual(mockAccounts);
    });

    it('should call the repository', () => {
      expect(accountRepositoryMock.findAll).toHaveBeenCalled();
    });
  });

  describe('When run method is called without any accounts', () => {
    it('should return an empty array', async () => {
      accountRepositoryMock.findAll.mockResolvedValueOnce([]);
      const result = await service.run();
      expect(result.length).toBe(0);
    });
  });
});
