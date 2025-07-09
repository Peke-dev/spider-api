import { WebhookRepository } from '@modules/webhooks/domain/repositories';
import { DeleteWebhookUseCase } from '../../../application/use-cases/delete-webhook.use-case';

describe('DeleteWebhookUseCase', () => {
  let useCase: DeleteWebhookUseCase;
  let repository: WebhookRepository;

  beforeEach(() => {
    repository = {
      create: jest.fn(),
      findAll: jest.fn(),
      findById: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    };

    useCase = new DeleteWebhookUseCase(repository);
  });

  it('should be defined', () => {
    expect(useCase).toBeDefined();
  });

  it('should delete webhook successfully', async () => {
    const webhookId = '123e4567-e89b-12d3-a456-426614174000';

    repository.delete = jest.fn().mockResolvedValue(undefined);

    await useCase.execute(webhookId);

    expect(repository.delete).toHaveBeenCalledTimes(1);
    expect(repository.delete).toHaveBeenCalledWith(webhookId);
  });

  it('should delete webhook with different ID format', async () => {
    const webhookId = 'webhook-123';

    repository.delete = jest.fn().mockResolvedValue(undefined);

    await useCase.execute(webhookId);

    expect(repository.delete).toHaveBeenCalledTimes(1);
    expect(repository.delete).toHaveBeenCalledWith(webhookId);
  });

  it('should handle empty string ID', async () => {
    const webhookId = '';

    repository.delete = jest.fn().mockResolvedValue(undefined);

    await useCase.execute(webhookId);

    expect(repository.delete).toHaveBeenCalledTimes(1);
    expect(repository.delete).toHaveBeenCalledWith(webhookId);
  });

  it('should handle repository errors', async () => {
    const webhookId = '123e4567-e89b-12d3-a456-426614174000';
    const error = new Error('Database error');

    repository.delete = jest.fn().mockRejectedValue(error);

    await expect(useCase.execute(webhookId)).rejects.toThrow(error);
    expect(repository.delete).toHaveBeenCalledTimes(1);
    expect(repository.delete).toHaveBeenCalledWith(webhookId);
  });

  it('should handle network timeout errors', async () => {
    const webhookId = '123e4567-e89b-12d3-a456-426614174000';
    const error = new Error('Network timeout');

    repository.delete = jest.fn().mockRejectedValue(error);

    await expect(useCase.execute(webhookId)).rejects.toThrow('Network timeout');
    expect(repository.delete).toHaveBeenCalledTimes(1);
    expect(repository.delete).toHaveBeenCalledWith(webhookId);
  });

  it('should handle webhook not found scenario', async () => {
    const webhookId = 'non-existent-webhook';
    const error = new Error('Webhook not found');

    repository.delete = jest.fn().mockRejectedValue(error);

    await expect(useCase.execute(webhookId)).rejects.toThrow(
      'Webhook not found',
    );
    expect(repository.delete).toHaveBeenCalledTimes(1);
    expect(repository.delete).toHaveBeenCalledWith(webhookId);
  });

  it('should handle permission denied errors', async () => {
    const webhookId = '123e4567-e89b-12d3-a456-426614174000';
    const error = new Error('Permission denied');

    repository.delete = jest.fn().mockRejectedValue(error);

    await expect(useCase.execute(webhookId)).rejects.toThrow(
      'Permission denied',
    );
    expect(repository.delete).toHaveBeenCalledTimes(1);
    expect(repository.delete).toHaveBeenCalledWith(webhookId);
  });

  it('should handle multiple delete operations', async () => {
    const webhookIds = [
      '123e4567-e89b-12d3-a456-426614174000',
      '123e4567-e89b-12d3-a456-426614174001',
      '123e4567-e89b-12d3-a456-426614174002',
    ];

    repository.delete = jest.fn().mockResolvedValue(undefined);

    for (const webhookId of webhookIds) {
      await useCase.execute(webhookId);
    }

    expect(repository.delete).toHaveBeenCalledTimes(3);
    expect(repository.delete).toHaveBeenNthCalledWith(1, webhookIds[0]);
    expect(repository.delete).toHaveBeenNthCalledWith(2, webhookIds[1]);
    expect(repository.delete).toHaveBeenNthCalledWith(3, webhookIds[2]);
  });
});
