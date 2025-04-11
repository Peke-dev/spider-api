import { Module } from '@nestjs/common';
import * as UseCases from './application/use-cases';
import { LeaguesController } from './infrastructure/controllers/leagues.controller';
import { BaseRepository } from '@domain/repositories';
import { Firestore } from 'firebase-admin/firestore';
import { LeagueRepository } from './infrastructure/repositories/firestore.repository';
import { LEAGUES_COLLECTION } from './constants';

@Module({
  imports: [],
  providers: [
    ...Object.values(UseCases),
    {
      provide: BaseRepository,
      useFactory: (firestore: Firestore) => {
        return new LeagueRepository(firestore, LEAGUES_COLLECTION);
      },
      inject: [Firestore],
    },
  ],
  exports: [...Object.values(UseCases)],
  controllers: [LeaguesController],
})
export class LeaguesModule {}
