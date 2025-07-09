import { Injectable } from '@nestjs/common';
import { WebhookRepository } from '../../domain/repositories';
import { CreateWebhookDto } from '../dto';

@Injectable()
export class CreateWebhookUseCase {
  constructor(private readonly webhookRepository: WebhookRepository) {}

  async execute(createWebhookDto: CreateWebhookDto): Promise<string> {
    const webhook = {
      ...createWebhookDto,
      created: new Date(),
      updated: new Date(),
    };

    return this.webhookRepository.create(webhook);
  }
}
