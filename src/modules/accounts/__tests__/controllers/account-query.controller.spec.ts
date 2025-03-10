import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { AccountQueryController } from '../../infraestructure/controllers/account-query.controller';
import {
  FindAccountByIdUseCase,
  FindAllAccountsUseCase,
} from '../../application/use-cases';
import { Account } from '../../domain/entities/account.entity';

describe('AccountQueryController', () => {
  let controller: AccountQueryController;
  let findAccountByIdUseCase: FindAccountByIdUseCase;
  let findAllAccountsUseCase: FindAllAccountsUseCase;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AccountQueryController],
      providers: [
        {
          provide: FindAccountByIdUseCase,
          useValue: {
            execute: jest.fn(),
          },
        },
        {
          provide: FindAllAccountsUseCase,
          useValue: {
            execute: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<AccountQueryController>(AccountQueryController);
    findAccountByIdUseCase = module.get<FindAccountByIdUseCase>(
      FindAccountByIdUseCase,
    );
    findAllAccountsUseCase = module.get<FindAllAccountsUseCase>(
      FindAllAccountsUseCase,
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('findAll', () => {
    it('should return all accounts', async () => {
      const mockAccounts = [
        new Account({
          id: 'test-id-1',
          email: 'test1@example.com',
          password: 'hashed_password',
          createdAt: new Date(),
          updatedAt: new Date(),
        }),
      ];

      jest
        .spyOn(findAllAccountsUseCase, 'execute')
        .mockResolvedValue(mockAccounts);

      const result = await controller.findAll();

      expect(result).toEqual(mockAccounts);
      expect(findAllAccountsUseCase.execute).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should return an account by id', async () => {
      const mockAccount = new Account({
        id: 'test-id',
        email: 'test@example.com',
        password: 'hashed_password',
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      jest
        .spyOn(findAccountByIdUseCase, 'execute')
        .mockResolvedValue(mockAccount);

      const result = await controller.findOne('test-id');

      expect(result).toEqual(mockAccount);
      expect(findAccountByIdUseCase.execute).toHaveBeenCalledWith('test-id');
    });

    it('should throw NotFoundException when account is not found', async () => {
      jest.spyOn(findAccountByIdUseCase, 'execute').mockResolvedValue(null);

      await expect(controller.findOne('non-existent-id')).rejects.toThrow(
        NotFoundException,
      );
    });
  });
});
