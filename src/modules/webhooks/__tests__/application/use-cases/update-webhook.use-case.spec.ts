import { WebhookRepository } from '@modules/webhooks/domain/repositories';
import { UpdateWebhookUseCase } from '../../../application/use-cases/update-webhook.use-case';
import { UpdateWebhookDto } from '../../../application/dto';

describe('UpdateWebhookUseCase', () => {
  let useCase: UpdateWebhookUseCase;
  let repository: WebhookRepository;

  beforeEach(() => {
    repository = {
      create: jest.fn(),
      findAll: jest.fn(),
      findById: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    };

    useCase = new UpdateWebhookUseCase(repository);
  });

  it('should be defined', () => {
    expect(useCase).toBeDefined();
  });

  it('should update webhook successfully with all fields', async () => {
    const webhookId = '123e4567-e89b-12d3-a456-426614174000';
    const updateWebhookDto: UpdateWebhookDto = {
      url: 'https://api.example.com/webhooks/updated-events',
      accountId: '123e4567-e89b-12d3-a456-426614174002',
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

    repository.update = jest.fn().mockResolvedValue(undefined);

    await useCase.execute(webhookId, updateWebhookDto);

    expect(repository.update).toHaveBeenCalledTimes(1);
    expect(repository.update).toHaveBeenCalledWith(
      webhookId,
      expect.objectContaining({
        url: updateWebhookDto.url,
        accountId: updateWebhookDto.accountId,
        subscriptions: updateWebhookDto.subscriptions,
        request: updateWebhookDto.request,
        updated: expect.any(Date),
      }),
    );
  });

  it('should update webhook with only URL', async () => {
    const webhookId = '123e4567-e89b-12d3-a456-426614174000';
    const updateWebhookDto: UpdateWebhookDto = {
      url: 'https://api.example.com/webhooks/new-url',
    };

    repository.update = jest.fn().mockResolvedValue(undefined);

    await useCase.execute(webhookId, updateWebhookDto);

    expect(repository.update).toHaveBeenCalledTimes(1);
    expect(repository.update).toHaveBeenCalledWith(
      webhookId,
      expect.objectContaining({
        url: updateWebhookDto.url,
        updated: expect.any(Date),
      }),
    );
  });

  it('should update webhook with only subscriptions', async () => {
    const webhookId = '123e4567-e89b-12d3-a456-426614174000';
    const updateWebhookDto: UpdateWebhookDto = {
      subscriptions: ['event.1', 'event.2'],
    };

    repository.update = jest.fn().mockResolvedValue(undefined);

    await useCase.execute(webhookId, updateWebhookDto);

    expect(repository.update).toHaveBeenCalledTimes(1);
    expect(repository.update).toHaveBeenCalledWith(
      webhookId,
      expect.objectContaining({
        subscriptions: updateWebhookDto.subscriptions,
        updated: expect.any(Date),
      }),
    );
  });

  it('should update webhook with empty subscriptions array', async () => {
    const webhookId = '123e4567-e89b-12d3-a456-426614174000';
    const updateWebhookDto: UpdateWebhookDto = {
      subscriptions: [],
    };

    repository.update = jest.fn().mockResolvedValue(undefined);

    await useCase.execute(webhookId, updateWebhookDto);

    expect(repository.update).toHaveBeenCalledTimes(1);
    expect(repository.update).toHaveBeenCalledWith(
      webhookId,
      expect.objectContaining({
        subscriptions: [],
        updated: expect.any(Date),
      }),
    );
  });

  it('should update webhook with only request data', async () => {
    const webhookId = '123e4567-e89b-12d3-a456-426614174000';
    const updateWebhookDto: UpdateWebhookDto = {
      request: {
        headers: {
          Authorization: 'Bearer new-token',
          'X-Custom-Header': 'new-value',
        },
        query: {
          version: 'v3',
          format: 'xml',
        },
      },
    };

    repository.update = jest.fn().mockResolvedValue(undefined);

    await useCase.execute(webhookId, updateWebhookDto);

    expect(repository.update).toHaveBeenCalledTimes(1);
    expect(repository.update).toHaveBeenCalledWith(
      webhookId,
      expect.objectContaining({
        request: updateWebhookDto.request,
        updated: expect.any(Date),
      }),
    );
  });

  it('should update webhook with empty request object', async () => {
    const webhookId = '123e4567-e89b-12d3-a456-426614174000';
    const updateWebhookDto: UpdateWebhookDto = {
      request: {
        headers: {},
        query: {},
      },
    };

    repository.update = jest.fn().mockResolvedValue(undefined);

    await useCase.execute(webhookId, updateWebhookDto);

    expect(repository.update).toHaveBeenCalledTimes(1);
    expect(repository.update).toHaveBeenCalledWith(
      webhookId,
      expect.objectContaining({
        request: updateWebhookDto.request,
        updated: expect.any(Date),
      }),
    );
  });

  it('should handle empty string ID', async () => {
    const webhookId = '';
    const updateWebhookDto: UpdateWebhookDto = {
      url: 'https://api.example.com/webhooks/events',
    };

    repository.update = jest.fn().mockResolvedValue(undefined);

    await useCase.execute(webhookId, updateWebhookDto);

    expect(repository.update).toHaveBeenCalledTimes(1);
    expect(repository.update).toHaveBeenCalledWith(
      webhookId,
      expect.objectContaining({
        url: updateWebhookDto.url,
        updated: expect.any(Date),
      }),
    );
  });

  it('should handle repository errors', async () => {
    const webhookId = '123e4567-e89b-12d3-a456-426614174000';
    const updateWebhookDto: UpdateWebhookDto = {
      url: 'https://api.example.com/webhooks/updated-events',
      subscriptions: ['matches.created'],
    };

    const error = new Error('Database error');
    repository.update = jest.fn().mockRejectedValue(error);

    await expect(useCase.execute(webhookId, updateWebhookDto)).rejects.toThrow(
      error,
    );
    expect(repository.update).toHaveBeenCalledTimes(1);
    expect(repository.update).toHaveBeenCalledWith(
      webhookId,
      expect.objectContaining({
        url: updateWebhookDto.url,
        subscriptions: updateWebhookDto.subscriptions,
        updated: expect.any(Date),
      }),
    );
  });

  it('should handle network timeout errors', async () => {
    const webhookId = '123e4567-e89b-12d3-a456-426614174000';
    const updateWebhookDto: UpdateWebhookDto = {
      url: 'https://api.example.com/webhooks/updated-events',
    };

    const error = new Error('Network timeout');
    repository.update = jest.fn().mockRejectedValue(error);

    await expect(useCase.execute(webhookId, updateWebhookDto)).rejects.toThrow(
      'Network timeout',
    );
    expect(repository.update).toHaveBeenCalledTimes(1);
    expect(repository.update).toHaveBeenCalledWith(
      webhookId,
      expect.objectContaining({
        url: updateWebhookDto.url,
        updated: expect.any(Date),
      }),
    );
  });

  it('should handle partial update with undefined fields', async () => {
    const webhookId = '123e4567-e89b-12d3-a456-426614174000';
    const updateWebhookDto: UpdateWebhookDto = {
      url: 'https://api.example.com/webhooks/updated-events',
      accountId: undefined,
      subscriptions: undefined,
      request: undefined,
    };

    repository.update = jest.fn().mockResolvedValue(undefined);

    await useCase.execute(webhookId, updateWebhookDto);

    expect(repository.update).toHaveBeenCalledTimes(1);
    expect(repository.update).toHaveBeenCalledWith(
      webhookId,
      expect.objectContaining({
        url: updateWebhookDto.url,
        accountId: undefined,
        subscriptions: undefined,
        request: undefined,
        updated: expect.any(Date),
      }),
    );
  });
});
