import { WebhookRepository } from '@modules/webhooks/domain/repositories';
import { CreateWebhookUseCase } from '../../../application/use-cases/create-webhook.use-case';
import { CreateWebhookDto } from '../../../application/dto';

describe('CreateWebhookUseCase', () => {
  let useCase: CreateWebhookUseCase;
  let repository: WebhookRepository;

  beforeEach(() => {
    repository = {
      create: jest.fn(),
      findAll: jest.fn(),
      findById: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    };

    useCase = new CreateWebhookUseCase(repository);
  });

  it('should be defined', () => {
    expect(useCase).toBeDefined();
  });

  it('should create a webhook successfully with all fields', async () => {
    const createWebhookDto: CreateWebhookDto = {
      id: '123e4567-e89b-12d3-a456-426614174000',
      url: 'https://api.example.com/webhooks/events',
      accountId: '123e4567-e89b-12d3-a456-426614174001',
      subscriptions: ['matches.created', 'leagues.updated'],
      request: {
        headers: {
          'Content-Type': 'application/json',
          'X-API-Key': 'secret-key',
        },
        query: {
          version: 'v1',
        },
      },
    };

    const expectedId = '123e4567-e89b-12d3-a456-426614174000';
    repository.create = jest.fn().mockResolvedValue(expectedId);

    const result = await useCase.execute(createWebhookDto);

    expect(result).toBe(expectedId);
    expect(repository.create).toHaveBeenCalledWith(
      expect.objectContaining({
        id: createWebhookDto.id,
        url: createWebhookDto.url,
        accountId: createWebhookDto.accountId,
        subscriptions: createWebhookDto.subscriptions,
        request: createWebhookDto.request,
        created: expect.any(Date),
        updated: expect.any(Date),
      }),
    );
  });

  it('should create a webhook successfully without optional fields', async () => {
    const createWebhookDto: CreateWebhookDto = {
      id: '123e4567-e89b-12d3-a456-426614174000',
      url: 'https://api.example.com/webhooks/events',
      accountId: '123e4567-e89b-12d3-a456-426614174001',
      subscriptions: ['matches.created'],
    };

    const expectedId = '123e4567-e89b-12d3-a456-426614174000';
    repository.create = jest.fn().mockResolvedValue(expectedId);

    const result = await useCase.execute(createWebhookDto);

    expect(result).toBe(expectedId);
    expect(repository.create).toHaveBeenCalledWith(
      expect.objectContaining({
        id: createWebhookDto.id,
        url: createWebhookDto.url,
        accountId: createWebhookDto.accountId,
        subscriptions: createWebhookDto.subscriptions,
        created: expect.any(Date),
        updated: expect.any(Date),
      }),
    );
  });

  it('should create a webhook with empty subscriptions array', async () => {
    const createWebhookDto: CreateWebhookDto = {
      id: '123e4567-e89b-12d3-a456-426614174000',
      url: 'https://api.example.com/webhooks/events',
      accountId: '123e4567-e89b-12d3-a456-426614174001',
      subscriptions: [],
    };

    const expectedId = '123e4567-e89b-12d3-a456-426614174000';
    repository.create = jest.fn().mockResolvedValue(expectedId);

    const result = await useCase.execute(createWebhookDto);

    expect(result).toBe(expectedId);
    expect(repository.create).toHaveBeenCalledWith(
      expect.objectContaining({
        subscriptions: [],
        created: expect.any(Date),
        updated: expect.any(Date),
      }),
    );
  });

  it('should handle repository errors', async () => {
    const createWebhookDto: CreateWebhookDto = {
      id: '123e4567-e89b-12d3-a456-426614174000',
      url: 'https://api.example.com/webhooks/events',
      accountId: '123e4567-e89b-12d3-a456-426614174001',
      subscriptions: ['matches.created', 'leagues.updated'],
    };

    const error = new Error('Database error');
    repository.create = jest.fn().mockRejectedValue(error);

    await expect(useCase.execute(createWebhookDto)).rejects.toThrow(error);
    expect(repository.create).toHaveBeenCalledWith(
      expect.objectContaining({
        id: createWebhookDto.id,
        url: createWebhookDto.url,
        accountId: createWebhookDto.accountId,
        subscriptions: createWebhookDto.subscriptions,
        created: expect.any(Date),
        updated: expect.any(Date),
      }),
    );
  });

  it('should handle repository returning different ID than provided', async () => {
    const createWebhookDto: CreateWebhookDto = {
      id: '123e4567-e89b-12d3-a456-426614174000',
      url: 'https://api.example.com/webhooks/events',
      accountId: '123e4567-e89b-12d3-a456-426614174001',
      subscriptions: ['matches.created'],
    };

    const returnedId = 'different-id-from-repository';
    repository.create = jest.fn().mockResolvedValue(returnedId);

    const result = await useCase.execute(createWebhookDto);

    expect(result).toBe(returnedId);
    expect(repository.create).toHaveBeenCalledWith(
      expect.objectContaining({
        id: createWebhookDto.id,
        url: createWebhookDto.url,
        accountId: createWebhookDto.accountId,
        subscriptions: createWebhookDto.subscriptions,
        created: expect.any(Date),
        updated: expect.any(Date),
      }),
    );
  });
});
