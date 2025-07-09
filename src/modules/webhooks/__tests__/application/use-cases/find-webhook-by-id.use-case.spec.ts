import { WebhookRepository } from '@modules/webhooks/domain/repositories';
import { FindWebhookByIdUseCase } from '../../../application/use-cases/find-webhook-by-id.use-case';
import { createMockWebhook } from '../../__mocks__/webhook.mock';

describe('FindWebhookByIdUseCase', () => {
  let useCase: FindWebhookByIdUseCase;
  let repository: WebhookRepository;

  beforeEach(() => {
    repository = {
      create: jest.fn(),
      findAll: jest.fn(),
      findById: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    };

    useCase = new FindWebhookByIdUseCase(repository);
  });

  it('should be defined', () => {
    expect(useCase).toBeDefined();
  });

  it('should return webhook when found', async () => {
    const mockWebhook = createMockWebhook();
    const webhookId = '123e4567-e89b-12d3-a456-426614174000';

    repository.findById = jest.fn().mockResolvedValue(mockWebhook);

    const result = await useCase.execute(webhookId);

    expect(result).toEqual(mockWebhook);
    expect(result).not.toBeNull();
    expect(repository.findById).toHaveBeenCalledTimes(1);
    expect(repository.findById).toHaveBeenCalledWith(webhookId);
  });

  it('should return null when webhook not found', async () => {
    const webhookId = 'non-existent-id';

    repository.findById = jest.fn().mockResolvedValue(null);

    const result = await useCase.execute(webhookId);

    expect(result).toBeNull();
    expect(repository.findById).toHaveBeenCalledTimes(1);
    expect(repository.findById).toHaveBeenCalledWith(webhookId);
  });

  it('should return webhook with minimal data', async () => {
    const minimalWebhook = createMockWebhook({
      id: 'minimal-webhook',
      subscriptions: [],
      request: undefined,
    });
    const webhookId = 'minimal-webhook';

    repository.findById = jest.fn().mockResolvedValue(minimalWebhook);

    const result = await useCase.execute(webhookId);

    expect(result).toEqual(minimalWebhook);
    expect(result?.subscriptions).toEqual([]);
    expect(result?.request).toBeUndefined();
    expect(repository.findById).toHaveBeenCalledTimes(1);
    expect(repository.findById).toHaveBeenCalledWith(webhookId);
  });

  it('should return webhook with complex request data', async () => {
    const complexWebhook = createMockWebhook({
      id: 'complex-webhook',
      subscriptions: ['event.1', 'event.2', 'event.3'],
      request: {
        headers: {
          Authorization: 'Bearer token',
          'Content-Type': 'application/json',
          'X-Custom-Header': 'custom-value',
        },
        query: {
          version: 'v2',
          format: 'json',
          include: 'metadata',
        },
      },
    });
    const webhookId = 'complex-webhook';

    repository.findById = jest.fn().mockResolvedValue(complexWebhook);

    const result = await useCase.execute(webhookId);

    expect(result).toEqual(complexWebhook);
    expect(result?.subscriptions).toHaveLength(3);
    expect(result?.request?.headers).toHaveProperty('Authorization');
    expect(result?.request?.query).toHaveProperty('version');
    expect(repository.findById).toHaveBeenCalledTimes(1);
    expect(repository.findById).toHaveBeenCalledWith(webhookId);
  });

  it('should handle empty string ID', async () => {
    const webhookId = '';

    repository.findById = jest.fn().mockResolvedValue(null);

    const result = await useCase.execute(webhookId);

    expect(result).toBeNull();
    expect(repository.findById).toHaveBeenCalledTimes(1);
    expect(repository.findById).toHaveBeenCalledWith(webhookId);
  });

  it('should handle repository errors', async () => {
    const webhookId = '123e4567-e89b-12d3-a456-426614174000';
    const error = new Error('Database error');

    repository.findById = jest.fn().mockRejectedValue(error);

    await expect(useCase.execute(webhookId)).rejects.toThrow(error);
    expect(repository.findById).toHaveBeenCalledTimes(1);
    expect(repository.findById).toHaveBeenCalledWith(webhookId);
  });

  it('should handle network timeout errors', async () => {
    const webhookId = '123e4567-e89b-12d3-a456-426614174000';
    const error = new Error('Network timeout');

    repository.findById = jest.fn().mockRejectedValue(error);

    await expect(useCase.execute(webhookId)).rejects.toThrow('Network timeout');
    expect(repository.findById).toHaveBeenCalledTimes(1);
    expect(repository.findById).toHaveBeenCalledWith(webhookId);
  });

  it('should handle repository returning undefined', async () => {
    const webhookId = 'undefined-webhook';

    repository.findById = jest.fn().mockResolvedValue(undefined);

    const result = await useCase.execute(webhookId);

    expect(result).toBeUndefined();
    expect(repository.findById).toHaveBeenCalledTimes(1);
    expect(repository.findById).toHaveBeenCalledWith(webhookId);
  });
});
