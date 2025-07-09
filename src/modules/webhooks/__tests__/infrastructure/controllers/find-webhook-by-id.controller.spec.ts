import { Test, TestingModule } from '@nestjs/testing';
import { FindWebhookByIdController } from '../../../infrastructure/controllers/find-webhook-by-id.controller';
import { FindWebhookByIdUseCase } from '../../../application/use-cases/find-webhook-by-id.use-case';
import { createMockWebhook } from '../../__mocks__/webhook.mock';

describe('FindWebhookByIdController', () => {
  let controller: FindWebhookByIdController;

  const findWebhookByIdUseCaseMock = {
    execute: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FindWebhookByIdController],
      providers: [
        {
          provide: FindWebhookByIdUseCase,
          useValue: findWebhookByIdUseCaseMock,
        },
      ],
    }).compile();

    controller = module.get<FindWebhookByIdController>(
      FindWebhookByIdController,
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('findOne', () => {
    it('should return webhook when found', async () => {
      const mockWebhook = createMockWebhook();
      const webhookId = '123e4567-e89b-12d3-a456-426614174000';

      findWebhookByIdUseCaseMock.execute.mockResolvedValue(mockWebhook);

      const result = await controller.findOne(webhookId);

      expect(result).toEqual(mockWebhook);
      expect(findWebhookByIdUseCaseMock.execute).toHaveBeenCalledWith(
        webhookId,
      );
    });

    it('should throw NotFoundException when webhook not found', async () => {
      const webhookId = 'non-existent-id';

      findWebhookByIdUseCaseMock.execute.mockResolvedValue(null);

      await expect(controller.findOne(webhookId)).rejects.toThrow(
        `Webhook with ID ${webhookId} not found`,
      );
      expect(findWebhookByIdUseCaseMock.execute).toHaveBeenCalledWith(
        webhookId,
      );
    });

    it('should handle use case errors', async () => {
      const webhookId = '123e4567-e89b-12d3-a456-426614174000';
      const error = new Error('Use case error');

      findWebhookByIdUseCaseMock.execute.mockRejectedValue(error);

      await expect(controller.findOne(webhookId)).rejects.toThrow(error);
      expect(findWebhookByIdUseCaseMock.execute).toHaveBeenCalledWith(
        webhookId,
      );
    });
  });
});
