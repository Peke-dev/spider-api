import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import * as UseCases from './application/use-cases';
import * as Controllers from './infrastructure/controllers';
import { WebhookMongooseRepository } from './infrastructure/repositories';
import { WebhookSchema, WebhookSchemaFactory } from './infrastructure/schemas';
import { WebhookRepository } from './domain/repositories';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: WebhookSchema.name, schema: WebhookSchemaFactory },
    ]),
  ],
  controllers: [...Object.values(Controllers)],
  providers: [
    ...Object.values(UseCases),
    {
      provide: WebhookRepository,
      useClass: WebhookMongooseRepository,
    },
  ],
  exports: [...Object.values(UseCases)],
})
export class WebhooksModule {}
