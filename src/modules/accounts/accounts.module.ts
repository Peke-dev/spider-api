import { Module } from '@nestjs/common';
import { DatabaseModule } from '@modules/database';
import * as services from './services';
import * as controllers from './controllers';
import { ACCOUNTS_COLLECTION } from './constants';

@Module({
  imports: [
    DatabaseModule.forFeature([
      {
        collection: ACCOUNTS_COLLECTION,
      },
    ]),
  ],
  providers: [...Object.values(services)],
  exports: [...Object.values(services)],
  controllers: [...Object.values(controllers)],
})
export class AccountsModule {}
