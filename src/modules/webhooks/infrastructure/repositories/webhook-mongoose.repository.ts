import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { WebhookRepository } from '../../domain/repositories';
import { Webhook } from '../../domain/entities';
import { WebhookSchema } from '../schemas';

@Injectable()
export class WebhookMongooseRepository implements WebhookRepository {
  constructor(
    @InjectModel(WebhookSchema.name)
    private readonly webhookModel: Model<WebhookSchema>,
  ) {}

  async create(webhook: Partial<Webhook>): Promise<string> {
    const newWebhook = {
      webhookId: webhook.id,
      url: webhook.url,
      accountId: webhook.accountId,
      subscriptions: webhook.subscriptions,
      request: webhook.request,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const savedWebhook = await this.webhookModel.create(newWebhook);
    return savedWebhook.webhookId;
  }

  async findAll(): Promise<Webhook[]> {
    const webhooks = await this.webhookModel.find().exec();

    return webhooks.map((webhook) => ({
      id: webhook.webhookId,
      url: webhook.url,
      created: webhook.createdAt,
      updated: webhook.updatedAt,
      accountId: webhook.accountId,
      subscriptions: webhook.subscriptions,
      request: webhook.request,
    }));
  }

  async findById(id: string): Promise<Webhook | null> {
    const webhook = await this.webhookModel.findOne({ webhookId: id }).exec();

    if (!webhook) {
      return null;
    }

    return {
      id: webhook.webhookId,
      url: webhook.url,
      created: webhook.createdAt,
      updated: webhook.updatedAt,
      accountId: webhook.accountId,
      subscriptions: webhook.subscriptions,
      request: webhook.request,
    };
  }

  async update(id: string, webhook: Partial<Webhook>): Promise<void> {
    const updateData: any = {
      updatedAt: new Date(),
    };

    if (webhook.url !== undefined) {
      updateData.url = webhook.url;
    }
    if (webhook.accountId !== undefined) {
      updateData.accountId = webhook.accountId;
    }
    if (webhook.subscriptions !== undefined) {
      updateData.subscriptions = webhook.subscriptions;
    }
    if (webhook.request !== undefined) {
      updateData.request = webhook.request;
    }

    await this.webhookModel.updateOne({ webhookId: id }, updateData).exec();
  }

  async delete(id: string): Promise<void> {
    await this.webhookModel.deleteOne({ webhookId: id }).exec();
  }
}
