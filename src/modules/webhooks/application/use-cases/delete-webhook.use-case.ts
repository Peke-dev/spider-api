import { Injectable } from '@nestjs/common';
import { WebhookRepository } from '../../domain/repositories';

@Injectable()
export class DeleteWebhookUseCase {
  constructor(private readonly webhookRepository: WebhookRepository) {}

  async execute(id: string): Promise<void> {
    await this.webhookRepository.delete(id);
  }
}
