import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';

import { AccountsModule } from '@modules/accounts';

import * as Controllers from './controllers';
import * as Services from './services';

@Module({
  imports: [
    AccountsModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'your-secret-key',
      signOptions: { expiresIn: '24h' },
    }),
  ],
  controllers: [...Object.values(Controllers)],
  providers: [...Object.values(Services)],
})
export class AuthModule {}
