import { DynamicModule, Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';

import {
  GetTokenByIdUseCase,
  CreateTokenUseCase,
  GetAllTokensUseCase,
} from './application/use-cases';
import { TokenMongooseRepository } from './infrastructure/persistence';
import { TokenStrategy } from './infrastructure/security/strategies/token.strategy';
import { AuthModuleOptionsAsync } from './infrastructure/interfaces';
import { AUTH_MODULE_OPTIONS } from './constants';
import {
  JwtAuthGuard,
  TokenAuthGuard,
  ScopesAuthGuard,
} from './infrastructure/security/guards';
import { TokenSchema, TokenSchemaFactory } from './infrastructure/schemas';
import { Token, TokenRepository, Scopes } from './domain';
import { AuthController, TokenController } from './infrastructure/controllers';

@Module({})
export class AuthModule {
  static registerAsync(options: AuthModuleOptionsAsync): DynamicModule {
    const { inject, useFactory } = options;

    return {
      module: AuthModule,
      imports: [
        PassportModule,
        MongooseModule.forFeature([
          { name: TokenSchema.name, schema: TokenSchemaFactory },
        ]),
        JwtModule.registerAsync({
          imports: [AuthModule],
          useFactory: async (...args) => {
            const options = await useFactory(...args);
            return { secret: options.secret };
          },
          inject,
        }),
      ],
      controllers: [AuthController, TokenController],
      providers: [
        {
          provide: 'TOKEN_LIST',
          useFactory: async (
            getAllTokensUseCase: GetAllTokensUseCase,
            createTokenUseCase: CreateTokenUseCase,
          ): Promise<Token[]> => {
            const tokens = await getAllTokensUseCase.execute();

            if (!tokens.length) {
              const token = await createTokenUseCase.execute({
                accountName: 'admin',
                scopes: [Scopes.ALL, Scopes.TOKENS_ALL],
              });
              return [token];
            }

            return tokens;
          },
          inject: [GetAllTokensUseCase, CreateTokenUseCase],
        },
        // Use Cases
        GetTokenByIdUseCase,
        CreateTokenUseCase,
        GetAllTokensUseCase,

        // Guards
        JwtAuthGuard,
        TokenAuthGuard,
        ScopesAuthGuard,

        // Strategies
        TokenStrategy,

        // Repositories
        {
          provide: TokenRepository,
          useClass: TokenMongooseRepository,
        },

        // Module Options
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
        ScopesAuthGuard,
        TokenRepository,
      ],
    };
  }
}
