import { ConsoleLogger, Module } from '@nestjs/common';

import { ConfigModule } from '@nestjs/config';
import { LoggerModule } from 'nestjs-pino';

import { FirestoreModule } from '@modules/firestore';
import { configuration, GlobalConfigType, validationSchema } from '@config';

export class LogService extends ConsoleLogger {}

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
  ],
})
export class AppModule {}
