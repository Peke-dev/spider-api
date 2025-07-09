import { Test, TestingModule } from '@nestjs/testing';
import { CreateWebhookController } from '../../../infrastructure/controllers/create-webhook.controller';
import { CreateWebhookUseCase } from '../../../application/use-cases/create-webhook.use-case';
import {
  CreateWebhookDto,
  CreateWebhookResponseDto,
} from '../../../application/dto';
import { plainToClass } from 'class-transformer';
import { validate } from 'class-validator';

describe('CreateWebhookController', () => {
  let controller: CreateWebhookController;

  const createWebhookUseCaseMock = {
    execute: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CreateWebhookController],
      providers: [
        {
          provide: CreateWebhookUseCase,
          useValue: createWebhookUseCaseMock,
        },
      ],
    }).compile();

    controller = module.get<CreateWebhookController>(CreateWebhookController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create a webhook successfully with valid data', async () => {
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

      createWebhookUseCaseMock.execute.mockResolvedValue(
        '123e4567-e89b-12d3-a456-426614174000',
      );

      const result = await controller.create(createWebhookDto);

      // Validar que la respuesta coincida con el DTO
      const validatedResponse = plainToClass(CreateWebhookResponseDto, result);
      const errors = await validate(validatedResponse);

      expect(errors).toHaveLength(0);
      expect(result).toEqual({ id: '123e4567-e89b-12d3-a456-426614174000' });
      expect(createWebhookUseCaseMock.execute).toHaveBeenCalledWith(
        createWebhookDto,
      );
    });

    it('should handle use case errors', async () => {
      const createWebhookDto: CreateWebhookDto = {
        id: '123e4567-e89b-12d3-a456-426614174000',
        url: 'https://api.example.com/webhooks/events',
        accountId: '123e4567-e89b-12d3-a456-426614174001',
        subscriptions: ['matches.created', 'leagues.updated'],
      };

      const error = new Error('Use case error');
      createWebhookUseCaseMock.execute.mockRejectedValue(error);

      await expect(controller.create(createWebhookDto)).rejects.toThrow(error);
      expect(createWebhookUseCaseMock.execute).toHaveBeenCalledWith(
        createWebhookDto,
      );
    });
  });
});
