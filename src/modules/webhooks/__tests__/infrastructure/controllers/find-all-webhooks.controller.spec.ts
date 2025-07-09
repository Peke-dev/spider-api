import { Test, TestingModule } from '@nestjs/testing';
import { FindAllWebhooksController } from '../../../infrastructure/controllers/find-all-webhooks.controller';
import { FindAllWebhooksUseCase } from '../../../application/use-cases/find-all-webhooks.use-case';
import { createMockWebhooks } from '../../__mocks__/webhook.mock';

describe('FindAllWebhooksController', () => {
  let controller: FindAllWebhooksController;

  const findAllWebhooksUseCaseMock = {
    execute: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FindAllWebhooksController],
      providers: [
        {
          provide: FindAllWebhooksUseCase,
          useValue: findAllWebhooksUseCaseMock,
        },
      ],
    }).compile();

    controller = module.get<FindAllWebhooksController>(
      FindAllWebhooksController,
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('findAll', () => {
    it('should return all webhooks successfully', async () => {
      const mockWebhooks = createMockWebhooks(3);
      findAllWebhooksUseCaseMock.execute.mockResolvedValue(mockWebhooks);

      const result = await controller.findAll();

      expect(result).toEqual(mockWebhooks);
      expect(findAllWebhooksUseCaseMock.execute).toHaveBeenCalled();
    });

    it('should return empty array when no webhooks exist', async () => {
      findAllWebhooksUseCaseMock.execute.mockResolvedValue([]);

      const result = await controller.findAll();

      expect(result).toEqual([]);
      expect(findAllWebhooksUseCaseMock.execute).toHaveBeenCalled();
    });

    it('should handle use case errors', async () => {
      const error = new Error('Use case error');
      findAllWebhooksUseCaseMock.execute.mockRejectedValue(error);

      await expect(controller.findAll()).rejects.toThrow(error);
      expect(findAllWebhooksUseCaseMock.execute).toHaveBeenCalled();
    });
  });
});
