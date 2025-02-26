import { Module } from '@nestjs/common';

import { DatabaseModule } from '@modules/database';

import { FindAllMatchesService } from './services/find-all-matches.service';
import { FindMatchByIdService } from './services/find-match-by-id.service';
import { MatchesController } from './controllers/matches.controller';
import { MATCHES_COLLECTION } from './constants';

@Module({
  imports: [
    DatabaseModule.forFeature([
      {
        collection: MATCHES_COLLECTION,
      },
    ]),
  ],
  providers: [FindAllMatchesService, FindMatchByIdService],
  exports: [FindAllMatchesService, FindMatchByIdService],
  controllers: [MatchesController],
})
export class MatchesModule {}
