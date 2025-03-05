import { Module } from '@nestjs/common';
import { DatabaseModule } from '@modules/database';
import { LEAGUES_COLLECTION } from './constants';
import * as UseCases from './application/use-cases';
import { LeaguesController } from './infrastructure/controllers/leagues.controller';

@Module({
  imports: [
    DatabaseModule.forFeature([
      {
        collection: LEAGUES_COLLECTION,
      },
    ]),
  ],
  providers: [...Object.values(UseCases)],
  exports: [...Object.values(UseCases)],
  controllers: [LeaguesController],
})
export class LeaguesModule {}
