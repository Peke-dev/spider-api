import { WebhookRepository } from '@modules/webhooks/domain/repositories';
import { MakeWebhookRequestUseCase } from '../../../application/use-cases/make-webhook-request.use-case';
import { createMockWebhook } from '../../__mocks__/webhook.mock';
import axios from 'axios';

jest.mock('axios');
const mockedAxios = axios as jest.MockedFunction<typeof axios>;

describe('MakeWebhookRequestUseCase', () => {
  let useCase: MakeWebhookRequestUseCase;
  let repository: WebhookRepository;

  beforeEach(() => {
    repository = {
      create: jest.fn(),
      findAll: jest.fn(),
      findById: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    } as WebhookRepository;

    useCase = new MakeWebhookRequestUseCase(repository);
    jest.clearAllMocks();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('execute', () => {
    it('should make webhook request successfully on first attempt', async () => {
      const webhookId = '123e4567-e89b-12d3-a456-426614174000';
      const mockWebhook = createMockWebhook({
        id: webhookId,
        url: 'https://api.example.com/webhooks/events',
        request: {
          headers: {
            Authorization: 'Bearer token',
            'X-Custom-Header': 'custom-value',
          },
          query: {
            version: 'v1',
            format: 'json',
          },
        },
      });

      const mockResponse = {
        status: 200,
        data: { success: true },
      };

      (mockedAxios as unknown as jest.Mock).mockResolvedValue(mockResponse);
      repository.findById = jest.fn().mockResolvedValue(mockWebhook);

      const result = await useCase.execute(webhookId, {
        method: 'POST',
        body: { event: 'test' },
      });

      expect(result).toEqual({
        success: true,
        statusCode: 200,
        response: { success: true },
        attempts: 1,
      });

      expect(repository.findById).toHaveBeenCalledWith(webhookId);
      expect(mockedAxios).toHaveBeenCalledWith(
        expect.objectContaining({
          url: 'https://api.example.com/webhooks/events?version=v1&format=json',
          method: 'POST',
          headers: expect.objectContaining({
            Authorization: 'Bearer token',
            'X-Custom-Header': 'custom-value',
            'Content-Type': 'application/json',
            'User-Agent': 'Spider-API-Webhook/1.0',
          }),
          data: { event: 'test' },
        }),
      );
    });

    it('should make webhook request with default options', async () => {
      const webhookId = '123e4567-e89b-12d3-a456-426614174000';
      const mockWebhook = createMockWebhook({
        id: webhookId,
        url: 'https://api.example.com/webhooks/events',
        request: undefined,
      });

      const mockResponse = {
        status: 200,
        data: { success: true },
      };

      (mockedAxios as unknown as jest.Mock).mockResolvedValue(mockResponse);
      repository.findById = jest.fn().mockResolvedValue(mockWebhook);

      const result = await useCase.execute(webhookId);

      expect(result.success).toBe(true);
      expect(result.attempts).toBe(1);
      expect(mockedAxios).toHaveBeenCalledWith(
        expect.objectContaining({
          url: 'https://api.example.com/webhooks/events',
          method: 'POST',
          headers: expect.objectContaining({
            'Content-Type': 'application/json',
            'User-Agent': 'Spider-API-Webhook/1.0',
          }),
          data: {},
        }),
      );
    });

    it('should retry on failure and succeed on second attempt', async () => {
      const webhookId = '123e4567-e89b-12d3-a456-426614174000';
      const mockWebhook = createMockWebhook({
        id: webhookId,
        url: 'https://api.example.com/webhooks/events',
      });

      (mockedAxios as unknown as jest.Mock)
        .mockRejectedValueOnce(new Error('Network error'))
        .mockResolvedValueOnce({
          status: 200,
          data: { success: true },
        });

      repository.findById = jest.fn().mockResolvedValue(mockWebhook);

      const result = await useCase.execute(webhookId, {
        maxRetries: 3,
        retryDelay: 100, // Short delay for testing
      });

      expect(result).toEqual({
        success: true,
        statusCode: 200,
        response: { success: true },
        attempts: 2,
      });

      expect(mockedAxios).toHaveBeenCalledTimes(2);
    });

    it('should fail after max retries', async () => {
      const webhookId = '123e4567-e89b-12d3-a456-426614174000';
      const mockWebhook = createMockWebhook({
        id: webhookId,
        url: 'https://api.example.com/webhooks/events',
        request: undefined,
      });

      (mockedAxios as unknown as jest.Mock).mockRejectedValue(
        new Error('Network error'),
      );
      repository.findById = jest.fn().mockResolvedValue(mockWebhook);

      const result = await useCase.execute(webhookId, {
        maxRetries: 3,
        retryDelay: 100, // Short delay for testing
      });

      expect(result).toEqual({
        success: false,
        error: 'Network error',
        attempts: 3,
      });

      expect(mockedAxios).toHaveBeenCalledTimes(3);
    }, 10000);

    it('should handle HTTP error responses', async () => {
      const webhookId = '123e4567-e89b-12d3-a456-426614174000';
      const mockWebhook = createMockWebhook({
        id: webhookId,
        url: 'https://api.example.com/webhooks/events',
        request: undefined,
      });

      (mockedAxios as unknown as jest.Mock).mockResolvedValue({
        status: 500,
        statusText: 'Internal Server Error',
        data: undefined,
      });
      repository.findById = jest.fn().mockResolvedValue(mockWebhook);

      const result = await useCase.execute(webhookId, {
        retryDelay: 100, // Short delay for testing
      });

      expect(result).toEqual({
        success: false,
        error: 'HTTP 500: Internal Server Error',
        attempts: 3,
      });
    }, 10000);

    it('should handle timeout errors', async () => {
      const webhookId = '123e4567-e89b-12d3-a456-426614174000';
      const mockWebhook = createMockWebhook({
        id: webhookId,
        url: 'https://api.example.com/webhooks/events',
        request: undefined,
      });

      const abortError = new Error('Request timeout');
      abortError.name = 'AbortError';

      (mockedAxios as unknown as jest.Mock).mockRejectedValue(abortError);
      repository.findById = jest.fn().mockResolvedValue(mockWebhook);

      const result = await useCase.execute(webhookId, {
        timeout: 1000,
        retryDelay: 100,
      });

      expect(result).toEqual({
        success: false,
        error: 'Request timeout',
        attempts: 3,
      });
    }, 10000);

    it('should handle webhook not found', async () => {
      const webhookId = 'non-existent-webhook';

      repository.findById = jest.fn().mockResolvedValue(null);

      await expect(useCase.execute(webhookId)).rejects.toThrow(
        'Webhook with ID non-existent-webhook not found',
      );

      expect(repository.findById).toHaveBeenCalledWith(webhookId);
      expect(mockedAxios).not.toHaveBeenCalled();
    });

    it('should handle webhook without request configuration', async () => {
      const webhookId = '123e4567-e89b-12d3-a456-426614174000';
      const mockWebhook = createMockWebhook({
        id: webhookId,
        url: 'https://api.example.com/webhooks/events',
        request: undefined,
      });

      (mockedAxios as unknown as jest.Mock).mockResolvedValue({
        status: 200,
        data: { success: true },
      });
      repository.findById = jest.fn().mockResolvedValue(mockWebhook);

      const result = await useCase.execute(webhookId);

      expect(result.success).toBe(true);
      expect(mockedAxios).toHaveBeenCalledWith(
        expect.objectContaining({
          url: 'https://api.example.com/webhooks/events',
          method: 'POST',
          headers: expect.objectContaining({
            'Content-Type': 'application/json',
            'User-Agent': 'Spider-API-Webhook/1.0',
          }),
        }),
      );
    });

    it('should handle GET requests without body', async () => {
      const webhookId = '123e4567-e89b-12d3-a456-426614174000';
      const mockWebhook = createMockWebhook({
        id: webhookId,
        url: 'https://api.example.com/webhooks/events',
        request: undefined,
      });

      (mockedAxios as unknown as jest.Mock).mockResolvedValue({
        status: 200,
        data: { success: true },
      });
      repository.findById = jest.fn().mockResolvedValue(mockWebhook);

      const result = await useCase.execute(webhookId, {
        method: 'GET',
      });

      expect(result.success).toBe(true);
      expect(mockedAxios).toHaveBeenCalledWith(
        expect.objectContaining({
          url: 'https://api.example.com/webhooks/events',
          method: 'GET',
          headers: expect.objectContaining({
            'Content-Type': 'application/json',
            'User-Agent': 'Spider-API-Webhook/1.0',
          }),
          data: undefined,
        }),
      );
    });

    it('should handle custom timeout and retry settings', async () => {
      const webhookId = '123e4567-e89b-12d3-a456-426614174000';
      const mockWebhook = createMockWebhook({
        id: webhookId,
        url: 'https://api.example.com/webhooks/events',
      });

      (mockedAxios as unknown as jest.Mock).mockResolvedValue({
        status: 200,
        data: { success: true },
      });
      repository.findById = jest.fn().mockResolvedValue(mockWebhook);

      const result = await useCase.execute(webhookId, {
        timeout: 5000,
        maxRetries: 2,
        retryDelay: 1000,
      });

      expect(result.success).toBe(true);
      expect(result.attempts).toBe(1);
    });

    it('should handle JSON parsing errors', async () => {
      const webhookId = '123e4567-e89b-12d3-a456-426614174000';
      const mockWebhook = createMockWebhook({
        id: webhookId,
        url: 'https://api.example.com/webhooks/events',
      });

      (mockedAxios as unknown as jest.Mock).mockResolvedValue({
        status: 200,
        data: { success: true },
      });
      repository.findById = jest.fn().mockResolvedValue(mockWebhook);

      const result = await useCase.execute(webhookId);

      expect(result).toEqual({
        success: true,
        statusCode: 200,
        response: { success: true },
        attempts: 1,
      });
    });
  });
});
