import { Module } from '@nestjs/common';
import * as UseCases from './application/use-cases';
import { LeaguesController } from './infrastructure/controllers/leagues.controller';
import { BaseRepository } from '@domain/repositories';
import { LeagueMongooseRepository } from './infrastructure/repositories';
import { LEAGUES_COLLECTION } from './constants';
import { getModelToken, MongooseModule } from '@nestjs/mongoose';
import { LeagueSchema, LeagueDocument } from './infrastructure/schemas';
import { Model } from 'mongoose';
@Module({
  imports: [
    MongooseModule.forFeature([
      { name: LEAGUES_COLLECTION, schema: LeagueSchema },
    ]),
  ],
  providers: [
    ...Object.values(UseCases),
    {
      provide: BaseRepository,
      useFactory: (model: Model<LeagueDocument>) => {
        return new LeagueMongooseRepository(model);
      },
      inject: [getModelToken(LEAGUES_COLLECTION)],
    },
  ],
  exports: [...Object.values(UseCases)],
  controllers: [LeaguesController],
})
export class LeaguesModule {}
