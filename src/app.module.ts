import { Module } from '@nestjs/common';
import { APP_INTERCEPTOR } from '@nestjs/core';

import { ConfigModule } from '@nestjs/config';
import { LoggerModule } from 'nestjs-pino';

import { FirestoreModule } from '@modules/firestore';
import { configuration, GlobalConfigType, validationSchema } from '@config';
import { MatchesModule } from '@modules/matches';
import { ResponseInterceptor } from '@common/interceptors';
import { LeaguesModule } from '@modules/leagues';
import { AccountsModule } from '@modules/accounts';

@Module({
  imports: [
    LoggerModule.forRoot(),
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: `${process.env.NODE_ENV}.env`,
      load: [configuration],
      validationSchema,
    }),
    FirestoreModule.registerAsync({
      global: true,
      useFactory: (config: GlobalConfigType) => ({
        serviceAccount: {
          projectId: config.FIRESTORE_PROJECT_ID,
          privateKey: config.FIRESTORE_PRIVATE_KEY,
          clientEmail: config.FIRESTORE_CLIENT_EMAIL,
        },
      }),
      inject: [configuration.KEY],
    }),
    MatchesModule,
    LeaguesModule,
    AccountsModule,
  ],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: ResponseInterceptor,
    },
  ],
})
export class AppModule {}
