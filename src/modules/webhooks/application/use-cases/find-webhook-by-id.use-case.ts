import { Injectable } from '@nestjs/common';
import { WebhookRepository } from '../../domain/repositories';
import { Webhook } from '../../domain/entities';

@Injectable()
export class FindWebhookByIdUseCase {
  constructor(private readonly webhookRepository: WebhookRepository) {}

  async execute(id: string): Promise<Webhook | null> {
    return this.webhookRepository.findById(id);
  }
}
