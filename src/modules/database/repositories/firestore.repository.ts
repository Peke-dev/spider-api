import { Injectable } from '@nestjs/common';

import { Firestore, CollectionReference } from 'firebase-admin/firestore';

import {
  FindAllOptionsInterface,
  RepositoryInterface,
} from '../interfaces/repository.interface';

@Injectable()
export class FirestoreRepository<T extends Record<string, any>>
  implements RepositoryInterface<T>
{
  private readonly docRef: CollectionReference;
  constructor(
    private readonly firestore: Firestore,
    private readonly collection: string,
  ) {
    this.docRef = this.firestore.collection(collection);
  }

  async findAll(options: FindAllOptionsInterface = {}): Promise<T[]> {
    const { orderBy = 'createdAt', order = 'desc' } = options;

    const snapshot = await this.docRef.orderBy(orderBy, order).get();

    return snapshot.docs.map(
      (doc) => ({ id: doc.id, ...doc.data() }) as unknown as T,
    );
  }

  async findOneById(id: string): Promise<T | null> {
    const doc = await this.docRef.doc(id).get();

    if (!doc.exists) {
      return null;
    }

    return { id: doc.id, ...doc.data() } as unknown as T;
  }

  async create(
    data: T & { createdAt: Date; updatedAt: Date },
  ): Promise<string> {
    const date = new Date();
    const docRef = this.docRef.doc();

    const { ...d } = data;

    d.createdAt = date;
    d.updatedAt = date;

    await docRef.set(d);
    return docRef.id;
  }

  async update(id: string, data: T & { updatedAt: Date }): Promise<string> {
    data.updatedAt = new Date();
    const docRef = this.docRef.doc(id);
    await docRef.update(data);
    return id;
  }
}
