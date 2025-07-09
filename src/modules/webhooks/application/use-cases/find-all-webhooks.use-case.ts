import { Injectable } from '@nestjs/common';
import { WebhookRepository } from '../../domain/repositories';
import { Webhook } from '../../domain/entities';

@Injectable()
export class FindAllWebhooksUseCase {
  constructor(private readonly webhookRepository: WebhookRepository) {}

  async execute(): Promise<Webhook[]> {
    return this.webhookRepository.findAll();
  }
}
