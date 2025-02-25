import { Module, DynamicModule } from '@nestjs/common';
import { RepositoryService } from './services/repository.service';
import { FirestoreModule } from '../firestore/firestore.module';
import { Firestore } from 'firebase-admin/firestore';

export class DbModuleOptions {
  collection: string;
}

@Module({})
export class DatabaseModule {
  static forFeature(models: DbModuleOptions[]): DynamicModule {
    return {
      module: DatabaseModule,
      imports: [FirestoreModule],
      providers: models.map(({ collection }) => {
        return {
          provide: collection,
          useFactory: (firestore: Firestore) =>
            new RepositoryService(firestore, collection),
          inject: [Firestore],
        };
      }),
      exports: [...models.map(({ collection }) => collection)],
    };
  }
}
