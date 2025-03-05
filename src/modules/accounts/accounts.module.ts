import { Module } from '@nestjs/common';
import { DatabaseModule } from '@modules/database';
import * as controllers from './infraestructure/controllers';
import * as useCases from './application/use-cases';
import { ACCOUNTS_COLLECTION } from './constants';

@Module({
  imports: [
    DatabaseModule.forFeature([
      {
        collection: ACCOUNTS_COLLECTION,
      },
    ]),
  ],
  providers: [...Object.values(useCases)],
  controllers: [...Object.values(controllers)],
  exports: [...Object.values(useCases)],
})
export class AccountsModule {}
