import { Test, TestingModule } from '@nestjs/testing';
import { UpdateWebhookController } from '../../../infrastructure/controllers/update-webhook.controller';
import { UpdateWebhookUseCase } from '../../../application/use-cases/update-webhook.use-case';
import { UpdateWebhookDto } from '../../../application/dto';

describe('UpdateWebhookController', () => {
  let controller: UpdateWebhookController;

  const updateWebhookUseCaseMock = {
    execute: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UpdateWebhookController],
      providers: [
        {
          provide: UpdateWebhookUseCase,
          useValue: updateWebhookUseCaseMock,
        },
      ],
    }).compile();

    controller = module.get<UpdateWebhookController>(UpdateWebhookController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('update', () => {
    it('should update webhook successfully', async () => {
      const webhookId = '123e4567-e89b-12d3-a456-426614174000';
      const updateWebhookDto: UpdateWebhookDto = {
        url: 'https://api.example.com/webhooks/updated-events',
        subscriptions: ['matches.created', 'leagues.updated', 'new.event'],
        request: {
          headers: {
            'Content-Type': 'application/json',
            'X-API-Key': 'updated-secret-key',
          },
          query: {
            version: 'v2',
          },
        },
      };

      updateWebhookUseCaseMock.execute.mockResolvedValue(undefined);

      await controller.update(webhookId, updateWebhookDto);

      expect(updateWebhookUseCaseMock.execute).toHaveBeenCalledWith(
        webhookId,
        updateWebhookDto,
      );
    });

    it('should handle use case errors', async () => {
      const webhookId = '123e4567-e89b-12d3-a456-426614174000';
      const updateWebhookDto: UpdateWebhookDto = {
        url: 'https://api.example.com/webhooks/updated-events',
        subscriptions: ['matches.created'],
      };

      const error = new Error('Use case error');
      updateWebhookUseCaseMock.execute.mockRejectedValue(error);

      await expect(
        controller.update(webhookId, updateWebhookDto),
      ).rejects.toThrow(error);
      expect(updateWebhookUseCaseMock.execute).toHaveBeenCalledWith(
        webhookId,
        updateWebhookDto,
      );
    });
  });
});
