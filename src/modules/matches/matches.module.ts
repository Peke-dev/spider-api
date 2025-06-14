import { Module } from '@nestjs/common';
import { MongooseModule, getModelToken } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import * as controllers from './infrastructure/controllers';
import * as UseCases from './application/use-cases';
import { MATCHES_COLLECTION } from './constants';
import { MatchRepository } from './domain/repositories';
import { MatchDocument, MatchSchema } from './infrastructure/schemas';
import { MatchMongooseRepository } from './infrastructure/repositories';
import { LeagueRepository } from '@modules/leagues/domain/repositories';
import { LeagueMongooseRepository } from '@modules/leagues/infrastructure/repositories';
import {
  LeagueDocument,
  LeagueSchema,
} from '@modules/leagues/infrastructure/schemas';
import { LEAGUES_COLLECTION } from '@modules/leagues/constants';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: MATCHES_COLLECTION, schema: MatchSchema },
      { name: LEAGUES_COLLECTION, schema: LeagueSchema },
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
    {
      provide: LeagueRepository,
      useFactory: (model: Model<LeagueDocument>) =>
        new LeagueMongooseRepository(model),
      inject: [getModelToken(LEAGUES_COLLECTION)],
    },
  ],
  exports: [...Object.values(UseCases)],
  controllers: [...Object.values(controllers)],
})
export class MatchesModule {}
