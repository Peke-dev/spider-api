import { DynamicModule, Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';

import { DatabaseModule } from '@modules/database';
import { ACCOUNTS_COLLECTION } from '@modules/accounts';

import { AuthController } from './controllers/auth.controller';
import * as Services from './services';
import { AccountsModule } from '../accounts/accounts.module';
import { JwtStrategy } from './strategies/jwt.strategy';
import { AuthModuleOptionsAsync } from './interfaces';
import { AUTH_MODULE_OPTIONS } from './constants';
import { JwtAuthGuard } from './guards';

@Module({})
export class AuthModule {
  static registerAsync(options: AuthModuleOptionsAsync): DynamicModule {
    const { inject, useFactory } = options;

    return {
      module: AuthModule,
      imports: [
        PassportModule,
        AccountsModule,
        PassportModule,
        JwtModule.registerAsync({
          imports: [AuthModule],
          useFactory: async (...args) => {
            const options = await useFactory(...args);
            return { secret: options.secret };
          },
          inject,
        }),
        DatabaseModule.forFeature([
          {
            collection: ACCOUNTS_COLLECTION,
          },
        ]),
      ],
      providers: [
        JwtAuthGuard,
        JwtStrategy,
        ...Object.values(Services),
        {
          provide: AUTH_MODULE_OPTIONS,
          useFactory: async (...args) => {
            const options = await useFactory(...args);
            return { secret: options.secret };
          },
          inject,
        },
      ],
      controllers: [AuthController],
      exports: [JwtModule, PassportModule, AUTH_MODULE_OPTIONS, JwtAuthGuard],
    };
  }
}
