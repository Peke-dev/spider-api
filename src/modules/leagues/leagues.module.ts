import { Module } from '@nestjs/common';
import { getModelToken, MongooseModule } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import * as UseCases from './application/use-cases';
import { LeaguesController } from './infrastructure/controllers/leagues.controller';
import { LeagueMongooseRepository } from './infrastructure/repositories';
import { LEAGUES_COLLECTION } from './constants';
import { LeagueSchema, LeagueDocument } from './infrastructure/schemas';
import { LeagueRepository } from './domain/repositories';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: LEAGUES_COLLECTION, schema: LeagueSchema },
    ]),
  ],
  providers: [
    ...Object.values(UseCases),
    {
      provide: LeagueRepository,
      useFactory: (model: Model<LeagueDocument>) =>
        new LeagueMongooseRepository(model),
      inject: [getModelToken(LEAGUES_COLLECTION)],
    },
  ],
  exports: [...Object.values(UseCases)],
  controllers: [LeaguesController],
})
export class LeaguesModule {}
