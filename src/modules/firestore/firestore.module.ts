import { DynamicModule, Module, Provider } from '@nestjs/common';
import { CONFIG_PROVIDER_KEY } from './constants';
import { initializeApp, cert } from 'firebase-admin/app';
import { getFirestore, Firestore } from 'firebase-admin/firestore';
import { FirestoreModuleOptions, FirestoreModuleOptionsAsync } from './interfaces';

@Module({})
export class FirestoreModule {
  static registerAsync(options: FirestoreModuleOptionsAsync): DynamicModule {
    const { global = false } = options;
    return {
      module: FirestoreModule,
      global,
      providers: [this.getConfigProvider(options), this.getFirestoreProvider()],
      exports: [this.getFirestoreProvider()],
    };
  }

  static getFirestoreProvider(): Provider {
    return {
      provide: Firestore,
      useFactory(options: FirestoreModuleOptions) {
        const { serviceAccount } = options;

        const app = initializeApp({
          credential: cert(serviceAccount),
        });

        return getFirestore(app);
      },
      inject: [CONFIG_PROVIDER_KEY],
    };
  }

  static getConfigProvider(options: FirestoreModuleOptionsAsync): Provider {
    return {
      provide: CONFIG_PROVIDER_KEY,
      useFactory: (...services) => options.useFactory(...services),
      inject: [...(options.inject || [])],
    };
  }
}
