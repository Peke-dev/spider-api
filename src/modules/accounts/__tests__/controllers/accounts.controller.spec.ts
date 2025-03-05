import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { AccountsController } from '../../infraestructure';
import {
  CreateAccountUseCase,
  FindAccountByIdUseCase,
  FindAllAccountsUseCase,
} from '../../application/use-cases';
import { Account } from '../../domain/entities/account.entity';

describe('AccountsController', () => {
  let controller: AccountsController;
  let createAccountUseCase: CreateAccountUseCase;
  let findAccountByIdUseCase: FindAccountByIdUseCase;
  let findAllAccountsUseCase: FindAllAccountsUseCase;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AccountsController],
      providers: [
        {
          provide: CreateAccountUseCase,
          useValue: {
            execute: jest.fn(),
          },
        },
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

    controller = module.get<AccountsController>(AccountsController);
    createAccountUseCase =
      module.get<CreateAccountUseCase>(CreateAccountUseCase);
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

  describe('create', () => {
    it('should create an account successfully', async () => {
      const createAccountDto = {
        email: 'test@example.com',
        password: 'password123',
      };

      jest
        .spyOn(createAccountUseCase, 'execute')
        .mockResolvedValue('new-account-id');

      const result = await controller.create(createAccountDto);

      expect(result).toEqual({ id: 'new-account-id' });
      expect(createAccountUseCase.execute).toHaveBeenCalledWith(
        createAccountDto,
      );
    });
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
      jest
        .spyOn(findAccountByIdUseCase, 'execute')
        .mockRejectedValue(new NotFoundException());

      await expect(controller.findOne('non-existent-id')).rejects.toThrow(
        NotFoundException,
      );
    });
  });
});
