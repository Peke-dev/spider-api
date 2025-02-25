import { ServiceAccount } from 'firebase-admin/app';

export class FirestoreModuleOptions {
  serviceAccount: ServiceAccount;
}

export class FirestoreModuleOptionsAsync {
  inject?: any[] = [];
  useFactory: (...args: any[]) => FirestoreModuleOptions;
  global?: boolean;
}
