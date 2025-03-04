import { Module } from '@nestjs/common';
import { DatabaseModule } from '@modules/database';
import * as controllers from './controllers';
import { ACCOUNTS_COLLECTION } from './constants';
import * as Services from './services';

@Module({
  imports: [
    DatabaseModule.forFeature([
      {
        collection: ACCOUNTS_COLLECTION,
      },
    ]),
  ],
  providers: [...Object.values(Services)],
  exports: [...Object.values(Services)],
  controllers: [...Object.values(controllers)],
})
export class AccountsModule {}
