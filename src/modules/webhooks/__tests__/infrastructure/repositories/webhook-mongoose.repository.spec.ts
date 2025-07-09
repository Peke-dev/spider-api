import { WebhookMongooseRepository } from '../../../infrastructure/repositories/webhook-mongoose.repository';
import { createMockWebhook } from '../../__mocks__/webhook.mock';

describe('WebhookMongooseRepository', () => {
  let repository: WebhookMongooseRepository;
  let mockWebhookModel: any;

  const mockWebhookDocument = {
    webhookId: '123e4567-e89b-12d3-a456-426614174000',
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
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  beforeEach(() => {
    mockWebhookModel = {
      create: jest.fn(),
      find: jest.fn(),
      findOne: jest.fn(),
      updateOne: jest.fn(),
      deleteOne: jest.fn(),
    };

    repository = new WebhookMongooseRepository(mockWebhookModel);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should create a webhook successfully', async () => {
      const webhookData = createMockWebhook();
      const savedWebhook = {
        ...mockWebhookDocument,
        webhookId: webhookData.id,
      };

      mockWebhookModel.create.mockResolvedValue(savedWebhook);

      const result = await repository.create(webhookData);

      expect(result).toBe(webhookData.id);
      expect(mockWebhookModel.create).toHaveBeenCalledWith({
        webhookId: webhookData.id,
        url: webhookData.url,
        accountId: webhookData.accountId,
        subscriptions: webhookData.subscriptions,
        request: webhookData.request,
        createdAt: expect.any(Date),
        updatedAt: expect.any(Date),
      });
    });

    it('should create a webhook without request data', async () => {
      const webhookData = createMockWebhook({
        request: undefined,
      });
      const savedWebhook = {
        ...mockWebhookDocument,
        webhookId: webhookData.id,
      };

      mockWebhookModel.create.mockResolvedValue(savedWebhook);

      const result = await repository.create(webhookData);

      expect(result).toBe(webhookData.id);
      expect(mockWebhookModel.create).toHaveBeenCalledWith({
        webhookId: webhookData.id,
        url: webhookData.url,
        accountId: webhookData.accountId,
        subscriptions: webhookData.subscriptions,
        request: undefined,
        createdAt: expect.any(Date),
        updatedAt: expect.any(Date),
      });
    });

    it('should handle save errors', async () => {
      const webhookData = createMockWebhook();
      const error = new Error('Database save error');

      mockWebhookModel.create.mockRejectedValue(error);

      await expect(repository.create(webhookData)).rejects.toThrow(error);
    });

    it('should create webhook with empty subscriptions array', async () => {
      const webhookData = createMockWebhook({
        subscriptions: [],
      });
      const savedWebhook = {
        ...mockWebhookDocument,
        webhookId: webhookData.id,
      };

      mockWebhookModel.create.mockResolvedValue(savedWebhook);

      const result = await repository.create(webhookData);

      expect(result).toBe(webhookData.id);
      expect(mockWebhookModel.create).toHaveBeenCalledWith(
        expect.objectContaining({
          subscriptions: [],
        }),
      );
    });
  });

  describe('findAll', () => {
    it('should return all webhooks successfully', async () => {
      const mockWebhooks = [
        {
          webhookId: 'webhook-1',
          url: 'https://api.example.com/webhooks/events-1',
          accountId: 'account-1',
          subscriptions: ['event.1'],
          request: { headers: { 'X-Key': 'value1' } },
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          webhookId: 'webhook-2',
          url: 'https://api.example.com/webhooks/events-2',
          accountId: 'account-2',
          subscriptions: ['event.2'],
          request: undefined,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];

      const mockExec = jest.fn().mockResolvedValue(mockWebhooks);
      mockWebhookModel.find.mockReturnValue({ exec: mockExec });

      const result = await repository.findAll();

      expect(result).toHaveLength(2);
      expect(result[0]).toEqual({
        id: 'webhook-1',
        url: 'https://api.example.com/webhooks/events-1',
        accountId: 'account-1',
        subscriptions: ['event.1'],
        request: { headers: { 'X-Key': 'value1' } },
        created: expect.any(Date),
        updated: expect.any(Date),
      });
      expect(result[1]).toEqual({
        id: 'webhook-2',
        url: 'https://api.example.com/webhooks/events-2',
        accountId: 'account-2',
        subscriptions: ['event.2'],
        request: undefined,
        created: expect.any(Date),
        updated: expect.any(Date),
      });
      expect(mockWebhookModel.find).toHaveBeenCalled();
      expect(mockExec).toHaveBeenCalled();
    });

    it('should return empty array when no webhooks exist', async () => {
      const mockExec = jest.fn().mockResolvedValue([]);
      mockWebhookModel.find.mockReturnValue({ exec: mockExec });

      const result = await repository.findAll();

      expect(result).toEqual([]);
      expect(mockWebhookModel.find).toHaveBeenCalled();
      expect(mockExec).toHaveBeenCalled();
    });

    it('should handle database errors', async () => {
      const error = new Error('Database connection error');
      const mockExec = jest.fn().mockRejectedValue(error);
      mockWebhookModel.find.mockReturnValue({ exec: mockExec });

      await expect(repository.findAll()).rejects.toThrow(error);
    });
  });

  describe('findById', () => {
    it('should return webhook when found', async () => {
      const webhookId = '123e4567-e89b-12d3-a456-426614174000';
      const mockWebhook = {
        webhookId: webhookId,
        url: 'https://api.example.com/webhooks/events',
        accountId: '123e4567-e89b-12d3-a456-426614174001',
        subscriptions: ['matches.created', 'leagues.updated'],
        request: {
          headers: { 'Content-Type': 'application/json' },
          query: { version: 'v1' },
        },
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const mockExec = jest.fn().mockResolvedValue(mockWebhook);
      mockWebhookModel.findOne.mockReturnValue({ exec: mockExec });

      const result = await repository.findById(webhookId);

      expect(result).toEqual({
        id: webhookId,
        url: 'https://api.example.com/webhooks/events',
        accountId: '123e4567-e89b-12d3-a456-426614174001',
        subscriptions: ['matches.created', 'leagues.updated'],
        request: {
          headers: { 'Content-Type': 'application/json' },
          query: { version: 'v1' },
        },
        created: expect.any(Date),
        updated: expect.any(Date),
      });
      expect(mockWebhookModel.findOne).toHaveBeenCalledWith({ webhookId });
      expect(mockExec).toHaveBeenCalled();
    });

    it('should return null when webhook not found', async () => {
      const webhookId = 'non-existent-id';
      const mockExec = jest.fn().mockResolvedValue(null);
      mockWebhookModel.findOne.mockReturnValue({ exec: mockExec });

      const result = await repository.findById(webhookId);

      expect(result).toBeNull();
      expect(mockWebhookModel.findOne).toHaveBeenCalledWith({ webhookId });
      expect(mockExec).toHaveBeenCalled();
    });

    it('should handle database errors', async () => {
      const webhookId = '123e4567-e89b-12d3-a456-426614174000';
      const error = new Error('Database error');
      const mockExec = jest.fn().mockRejectedValue(error);
      mockWebhookModel.findOne.mockReturnValue({ exec: mockExec });

      await expect(repository.findById(webhookId)).rejects.toThrow(error);
    });

    it('should return webhook with minimal data', async () => {
      const webhookId = 'minimal-webhook';
      const mockWebhook = {
        webhookId: webhookId,
        url: 'https://api.example.com/webhooks/events',
        accountId: 'account-1',
        subscriptions: [],
        request: undefined,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const mockExec = jest.fn().mockResolvedValue(mockWebhook);
      mockWebhookModel.findOne.mockReturnValue({ exec: mockExec });

      const result = await repository.findById(webhookId);

      expect(result).toEqual({
        id: webhookId,
        url: 'https://api.example.com/webhooks/events',
        accountId: 'account-1',
        subscriptions: [],
        request: undefined,
        created: expect.any(Date),
        updated: expect.any(Date),
      });
    });
  });

  describe('update', () => {
    it('should update webhook successfully with all fields', async () => {
      const webhookId = '123e4567-e89b-12d3-a456-426614174000';
      const updateData = {
        url: 'https://api.example.com/webhooks/updated-events',
        accountId: '123e4567-e89b-12d3-a456-426614174002',
        subscriptions: ['matches.created', 'leagues.updated', 'new.event'],
        request: {
          headers: { 'X-API-Key': 'updated-secret-key' },
          query: { version: 'v2' },
        },
      };

      const mockExec = jest.fn().mockResolvedValue({ modifiedCount: 1 });
      mockWebhookModel.updateOne.mockReturnValue({ exec: mockExec });

      await repository.update(webhookId, updateData);

      expect(mockWebhookModel.updateOne).toHaveBeenCalledWith(
        { webhookId },
        {
          url: updateData.url,
          accountId: updateData.accountId,
          subscriptions: updateData.subscriptions,
          request: updateData.request,
          updatedAt: expect.any(Date),
        },
      );
      expect(mockExec).toHaveBeenCalled();
    });

    it('should update webhook with only URL', async () => {
      const webhookId = '123e4567-e89b-12d3-a456-426614174000';
      const updateData = {
        url: 'https://api.example.com/webhooks/new-url',
      };

      const mockExec = jest.fn().mockResolvedValue({ modifiedCount: 1 });
      mockWebhookModel.updateOne.mockReturnValue({ exec: mockExec });

      await repository.update(webhookId, updateData);

      expect(mockWebhookModel.updateOne).toHaveBeenCalledWith(
        { webhookId },
        {
          url: updateData.url,
          updatedAt: expect.any(Date),
        },
      );
    });

    it('should update webhook with only subscriptions', async () => {
      const webhookId = '123e4567-e89b-12d3-a456-426614174000';
      const updateData = {
        subscriptions: ['event.1', 'event.2'],
      };

      const mockExec = jest.fn().mockResolvedValue({ modifiedCount: 1 });
      mockWebhookModel.updateOne.mockReturnValue({ exec: mockExec });

      await repository.update(webhookId, updateData);

      expect(mockWebhookModel.updateOne).toHaveBeenCalledWith(
        { webhookId },
        {
          subscriptions: updateData.subscriptions,
          updatedAt: expect.any(Date),
        },
      );
    });

    it('should update webhook with empty subscriptions array', async () => {
      const webhookId = '123e4567-e89b-12d3-a456-426614174000';
      const updateData = {
        subscriptions: [],
      };

      const mockExec = jest.fn().mockResolvedValue({ modifiedCount: 1 });
      mockWebhookModel.updateOne.mockReturnValue({ exec: mockExec });

      await repository.update(webhookId, updateData);

      expect(mockWebhookModel.updateOne).toHaveBeenCalledWith(
        { webhookId },
        {
          subscriptions: [],
          updatedAt: expect.any(Date),
        },
      );
    });

    it('should update webhook with undefined fields', async () => {
      const webhookId = '123e4567-e89b-12d3-a456-426614174000';
      const updateData = {
        url: 'https://api.example.com/webhooks/updated-events',
        accountId: undefined,
        subscriptions: undefined,
        request: undefined,
      };

      const mockExec = jest.fn().mockResolvedValue({ modifiedCount: 1 });
      mockWebhookModel.updateOne.mockReturnValue({ exec: mockExec });

      await repository.update(webhookId, updateData);

      expect(mockWebhookModel.updateOne).toHaveBeenCalledWith(
        { webhookId },
        {
          url: updateData.url,
          accountId: undefined,
          subscriptions: undefined,
          request: undefined,
          updatedAt: expect.any(Date),
        },
      );
    });

    it('should handle database errors', async () => {
      const webhookId = '123e4567-e89b-12d3-a456-426614174000';
      const updateData = { url: 'https://api.example.com/webhooks/events' };
      const error = new Error('Database error');
      const mockExec = jest.fn().mockRejectedValue(error);
      mockWebhookModel.updateOne.mockReturnValue({ exec: mockExec });

      await expect(repository.update(webhookId, updateData)).rejects.toThrow(
        error,
      );
    });
  });

  describe('delete', () => {
    it('should delete webhook successfully', async () => {
      const webhookId = '123e4567-e89b-12d3-a456-426614174000';
      const mockExec = jest.fn().mockResolvedValue({ deletedCount: 1 });
      mockWebhookModel.deleteOne.mockReturnValue({ exec: mockExec });

      await repository.delete(webhookId);

      expect(mockWebhookModel.deleteOne).toHaveBeenCalledWith({ webhookId });
      expect(mockExec).toHaveBeenCalled();
    });

    it('should handle database errors', async () => {
      const webhookId = '123e4567-e89b-12d3-a456-426614174000';
      const error = new Error('Database error');
      const mockExec = jest.fn().mockRejectedValue(error);
      mockWebhookModel.deleteOne.mockReturnValue({ exec: mockExec });

      await expect(repository.delete(webhookId)).rejects.toThrow(error);
    });

    it('should handle empty string ID', async () => {
      const webhookId = '';
      const mockExec = jest.fn().mockResolvedValue({ deletedCount: 0 });
      mockWebhookModel.deleteOne.mockReturnValue({ exec: mockExec });

      await repository.delete(webhookId);

      expect(mockWebhookModel.deleteOne).toHaveBeenCalledWith({
        webhookId: '',
      });
      expect(mockExec).toHaveBeenCalled();
    });

    it('should handle webhook not found scenario', async () => {
      const webhookId = 'non-existent-webhook';
      const mockExec = jest.fn().mockResolvedValue({ deletedCount: 0 });
      mockWebhookModel.deleteOne.mockReturnValue({ exec: mockExec });

      await repository.delete(webhookId);

      expect(mockWebhookModel.deleteOne).toHaveBeenCalledWith({ webhookId });
      expect(mockExec).toHaveBeenCalled();
    });
  });
});
