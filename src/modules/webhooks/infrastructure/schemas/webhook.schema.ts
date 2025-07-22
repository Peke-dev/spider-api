import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import {
  WebhookRequestSchema,
  WebhookRequestSchemaFactory,
} from './webhook-request.schema';

@Schema({
  timestamps: true,
  collection: 'webhooks',
})
export class WebhookSchema extends Document {
  @Prop({ required: true, unique: true, index: true })
  webhookId: string;

  @Prop({ required: true })
  url: string;

  @Prop({ required: true })
  accountId: string;

  @Prop({ required: true, type: [String] })
  subscriptions: string[];

  @Prop({ type: WebhookRequestSchemaFactory, required: false })
  request?: WebhookRequestSchema;

  @Prop({ required: true })
  createdAt: Date;

  @Prop({ required: true })
  updatedAt: Date;
}

export const WebhookSchemaFactory = SchemaFactory.createForClass(WebhookSchema);
export type WebhookDocument = Document<WebhookSchema>;
