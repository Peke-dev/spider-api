import { Injectable } from '@nestjs/common';
import { WebhookRepository } from '../../domain/repositories';
import { UpdateWebhookDto } from '../dto';

@Injectable()
export class UpdateWebhookUseCase {
  constructor(private readonly webhookRepository: WebhookRepository) {}

  async execute(id: string, updateWebhookDto: UpdateWebhookDto): Promise<void> {
    const webhook = {
      ...updateWebhookDto,
      updated: new Date(),
    };

    await this.webhookRepository.update(id, webhook);
  }
}
