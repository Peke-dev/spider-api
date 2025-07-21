import { Module } from '@nestjs/common';
import { APP_INTERCEPTOR, APP_GUARD } from '@nestjs/core';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';

import { EventEmitterModule } from '@nestjs/event-emitter';

import { configuration, GlobalConfigType, validationSchema } from '@config';
import { MatchesModule } from '@modules/matches';
import { ResponseInterceptor } from '@common/interceptors';
import { LeaguesModule } from '@modules/leagues';
import { AuthModule, TokenAuthGuard, ScopesAuthGuard } from '@modules/auth';

import { AppController } from './app.controller';
import { WebhooksModule } from '@modules/webhooks';
import { LoggerModule } from '@modules/logger';

@Module({
  imports: [
    LoggerModule.forRoot({ env: process.env.NODE_ENV || 'dev' }),
    EventEmitterModule.forRoot(),
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: `${process.env.NODE_ENV ? process.env.NODE_ENV : ''}.env`,
      load: [configuration],
      validationSchema,
    }),
    AuthModule.registerAsync({
      inject: [configuration.KEY],
      useFactory: (config) => ({ secret: config.JWT_SECRET }),
    }),
    MatchesModule,
    LeaguesModule,
    WebhooksModule,
    MongooseModule.forRootAsync({
      useFactory: (config: GlobalConfigType) => ({
        uri: config.MONGO_URI,
      }),
      inject: [configuration.KEY],
    }),
  ],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: ResponseInterceptor,
    },
    {
      provide: APP_GUARD,
      useClass: TokenAuthGuard,
    },
    ScopesAuthGuard,
  ],
  controllers: [AppController],
})
export class AppModule {}
