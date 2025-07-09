import { Webhook } from '../entities';

export abstract class WebhookRepository {
  abstract create(webhook: Partial<Webhook>): Promise<string>;
  abstract findAll(): Promise<Webhook[]>;
  abstract findById(id: string): Promise<Webhook | null>;
  abstract update(id: string, webhook: Partial<Webhook>): Promise<void>;
  abstract delete(id: string): Promise<void>;
}
