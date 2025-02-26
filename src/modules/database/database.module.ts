import { Module, DynamicModule } from '@nestjs/common';
import { Firestore } from 'firebase-admin/firestore';

import { FirestoreRepository } from './repositories/firestore.repository';
import { FirestoreModule } from '../firestore/firestore.module';
import { DbModuleOptionsInterface } from './interfaces';

@Module({})
export class DatabaseModule {
  static forFeature(models: DbModuleOptionsInterface[]): DynamicModule {
    return {
      module: DatabaseModule,
      imports: [FirestoreModule],
      providers: models.map(({ collection }) => {
        return {
          provide: collection,
          useFactory: (firestore: Firestore) =>
            new FirestoreRepository(firestore, collection),
          inject: [Firestore],
        };
      }),
      exports: [...models.map(({ collection }) => collection)],
    };
  }
}
