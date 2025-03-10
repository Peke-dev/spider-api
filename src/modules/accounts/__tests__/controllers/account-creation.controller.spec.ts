import { Test, TestingModule } from '@nestjs/testing';
import { AccountCreationController } from '../../infraestructure/controllers/account-creation.controller';
import { CreateAccountUseCase } from '../../application/use-cases';

describe('AccountCreationController', () => {
  let controller: AccountCreationController;
  let createAccountUseCase: CreateAccountUseCase;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AccountCreationController],
      providers: [
        {
          provide: CreateAccountUseCase,
          useValue: {
            execute: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<AccountCreationController>(
      AccountCreationController,
    );
    createAccountUseCase =
      module.get<CreateAccountUseCase>(CreateAccountUseCase);
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
});
