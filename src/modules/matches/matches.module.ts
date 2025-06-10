import { Module } from '@nestjs/common';
import { MongooseModule, getModelToken } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import * as controllers from './infrastructure/controllers';
import * as UseCases from './application/use-cases';
import { MATCHES_COLLECTION } from './constants';
import { MatchRepository } from './domain/repositories';
import { MatchDocument, MatchSchema } from './infrastructure/schemas';
import { MatchMongooseRepository } from './infrastructure/repositories';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: MATCHES_COLLECTION, schema: MatchSchema },
    ]),
  ],
  providers: [
    ...Object.values(UseCases),
    {
      provide: MatchRepository,
      useFactory: (model: Model<MatchDocument>) =>
        new MatchMongooseRepository(model),
      inject: [getModelToken(MATCHES_COLLECTION)],
    },
  ],
  exports: [...Object.values(UseCases)],
  controllers: [...Object.values(controllers)],
})
export class MatchesModule {}
