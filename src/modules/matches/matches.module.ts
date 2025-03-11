import { Module } from '@nestjs/common';
import * as controllers from './infrastructure/controllers';
import {
  CreateMatchUseCase,
  FindMatchByIdUseCase,
  FindAllMatchesUseCase,
} from './application/use-cases';
import { MATCHES_COLLECTION } from './constants';
import { DatabaseModule } from '@modules/database';

@Module({
  imports: [
    DatabaseModule.forFeature([
      {
        collection: MATCHES_COLLECTION,
      },
    ]),
  ],
  providers: [CreateMatchUseCase, FindMatchByIdUseCase, FindAllMatchesUseCase],
  controllers: [...Object.values(controllers)],
})
export class MatchesModule {}
