import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ _id: false })
export class WebhookRequestSchema extends Document {
  @Prop({ type: Object, required: false })
  headers?: Record<string, any>;

  @Prop({ type: Object, required: false })
  query?: Record<string, any>;
}

export const WebhookRequestSchemaFactory =
  SchemaFactory.createForClass(WebhookRequestSchema);
