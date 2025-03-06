import { DynamicModule, Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';

import { DatabaseModule, RepositoryInterface } from '@modules/database';
import { Account, ACCOUNTS_COLLECTION } from '@modules/accounts';

import { AuthController } from './infrastructure/controllers/auth.controller';
import { LoginUseCase } from './application/use-cases/login.use-case';
import { AccountRepository } from './infrastructure/persistence/account.repository';
import { AccountsModule } from '../accounts/accounts.module';
import { JwtStrategy } from './infrastructure/security/strategies/jwt.strategy';
import { AuthModuleOptionsAsync } from './infrastructure/interfaces';
import { AUTH_MODULE_OPTIONS } from './constants';
import { JwtAuthGuard } from './infrastructure/security/guards';

@Module({})
export class AuthModule {
  static registerAsync(options: AuthModuleOptionsAsync): DynamicModule {
    const { inject, useFactory } = options;

    return {
      module: AuthModule,
      imports: [
        PassportModule,
        AccountsModule,
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
        LoginUseCase,
        {
          provide: AccountRepository,
          useFactory: (repository: RepositoryInterface<Account>) => {
            return new AccountRepository(repository);
          },
          inject: [ACCOUNTS_COLLECTION],
        },
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
