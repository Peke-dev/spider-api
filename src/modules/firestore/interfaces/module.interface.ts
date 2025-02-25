import { InjectionToken, OptionalFactoryDependency } from '@nestjs/common';

import { ServiceAccount } from 'firebase-admin/app';

export class FirestoreModuleOptions {
  serviceAccount: ServiceAccount;
}

export class FirestoreModuleOptionsAsync {
  inject?: (InjectionToken | OptionalFactoryDependency)[] = [];
  useFactory: (...args: unknown[]) => FirestoreModuleOptions;
  global?: boolean;
}
