import { Module } from '@nestjs/common';
import { APP_INTERCEPTOR, APP_GUARD } from '@nestjs/core';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { LoggerModule } from 'nestjs-pino';

import { configuration, GlobalConfigType, validationSchema } from '@config';
import { MatchesModule } from '@modules/matches';
import { ResponseInterceptor } from '@common/interceptors';
import { LeaguesModule } from '@modules/leagues';
import { AuthModule, TokenAuthGuard } from '@modules/auth';

import { AppController } from './app.controller';

@Module({
  imports: [
    LoggerModule.forRoot(),
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
  ],
  controllers: [AppController],
})
export class AppModule {}
