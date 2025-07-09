import { WebhookRepository } from '@modules/webhooks/domain/repositories';
import { FindAllWebhooksUseCase } from '../../../application/use-cases/find-all-webhooks.use-case';
import {
  createMockWebhooks,
  createMockWebhook,
} from '../../__mocks__/webhook.mock';

describe('FindAllWebhooksUseCase', () => {
  let useCase: FindAllWebhooksUseCase;
  let repository: WebhookRepository;

  beforeEach(() => {
    repository = {
      create: jest.fn(),
      findAll: jest.fn(),
      findById: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    };

    useCase = new FindAllWebhooksUseCase(repository);
  });

  it('should be defined', () => {
    expect(useCase).toBeDefined();
  });

  it('should return all webhooks successfully', async () => {
    const mockWebhooks = createMockWebhooks(3);
    repository.findAll = jest.fn().mockResolvedValue(mockWebhooks);

    const result = await useCase.execute();

    expect(result).toEqual(mockWebhooks);
    expect(result).toHaveLength(3);
    expect(repository.findAll).toHaveBeenCalledTimes(1);
    expect(repository.findAll).toHaveBeenCalledWith();
  });

  it('should return empty array when no webhooks exist', async () => {
    repository.findAll = jest.fn().mockResolvedValue([]);

    const result = await useCase.execute();

    expect(result).toEqual([]);
    expect(result).toHaveLength(0);
    expect(repository.findAll).toHaveBeenCalledTimes(1);
    expect(repository.findAll).toHaveBeenCalledWith();
  });

  it('should return single webhook when only one exists', async () => {
    const mockWebhook = createMockWebhook();
    repository.findAll = jest.fn().mockResolvedValue([mockWebhook]);

    const result = await useCase.execute();

    expect(result).toEqual([mockWebhook]);
    expect(result).toHaveLength(1);
    expect(repository.findAll).toHaveBeenCalledTimes(1);
    expect(repository.findAll).toHaveBeenCalledWith();
  });

  it('should return webhooks with different data structures', async () => {
    const mockWebhooks = [
      createMockWebhook({
        id: 'webhook-1',
        subscriptions: ['event.1'],
        request: undefined,
      }),
      createMockWebhook({
        id: 'webhook-2',
        subscriptions: [],
        request: {
          headers: { 'Custom-Header': 'value' },
          query: {},
        },
      }),
    ];
    repository.findAll = jest.fn().mockResolvedValue(mockWebhooks);

    const result = await useCase.execute();

    expect(result).toEqual(mockWebhooks);
    expect(result).toHaveLength(2);
    expect(result[0].subscriptions).toEqual(['event.1']);
    expect(result[0].request).toBeUndefined();
    expect(result[1].subscriptions).toEqual([]);
    expect(result[1].request).toBeDefined();
    expect(repository.findAll).toHaveBeenCalledTimes(1);
  });

  it('should handle repository errors', async () => {
    const error = new Error('Database error');
    repository.findAll = jest.fn().mockRejectedValue(error);

    await expect(useCase.execute()).rejects.toThrow(error);
    expect(repository.findAll).toHaveBeenCalledTimes(1);
    expect(repository.findAll).toHaveBeenCalledWith();
  });

  it('should handle network errors', async () => {
    const error = new Error('Network timeout');
    repository.findAll = jest.fn().mockRejectedValue(error);

    await expect(useCase.execute()).rejects.toThrow('Network timeout');
    expect(repository.findAll).toHaveBeenCalledTimes(1);
  });

  it('should handle repository returning null', async () => {
    repository.findAll = jest.fn().mockResolvedValue(null);

    const result = await useCase.execute();

    expect(result).toBeNull();
    expect(repository.findAll).toHaveBeenCalledTimes(1);
  });
});
