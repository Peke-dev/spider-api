import { DynamicModule, Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';

import { RepositoryInterface } from '@modules/database';
import { Account, ACCOUNTS_COLLECTION } from '@modules/accounts';

import { AuthController } from './infrastructure/controllers/auth.controller';
import { LoginUseCase } from './application/use-cases/login.use-case';
import { AccountRepository } from './infrastructure/persistence/account.repository';
import { JwtStrategy } from './infrastructure/security/strategies/jwt.strategy';
import { TokenStrategy } from './infrastructure/security/strategies/token.strategy';
import { AuthModuleOptionsAsync } from './infrastructure/interfaces';
import { AUTH_MODULE_OPTIONS } from './constants';
import { JwtAuthGuard, TokenAuthGuard } from './infrastructure/security/guards';

@Module({})
export class AuthModule {
  static registerAsync(options: AuthModuleOptionsAsync): DynamicModule {
    const { inject, useFactory } = options;

    return {
      module: AuthModule,
      imports: [
        PassportModule,
        JwtModule.registerAsync({
          imports: [AuthModule],
          useFactory: async (...args) => {
            const options = await useFactory(...args);
            return { secret: options.secret };
          },
          inject,
        }),
      ],
      providers: [
        JwtAuthGuard,
        TokenAuthGuard,
        TokenStrategy,
        {
          provide: AUTH_MODULE_OPTIONS,
          useFactory: async (...args) => {
            const options = await useFactory(...args);
            return { secret: options.secret };
          },
          inject,
        },
      ],
      exports: [
        JwtModule,
        PassportModule,
        AUTH_MODULE_OPTIONS,
        JwtAuthGuard,
        TokenAuthGuard,
      ],
    };
  }
}
