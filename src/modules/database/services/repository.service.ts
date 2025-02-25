import { Injectable } from '@nestjs/common';
import { Firestore, CollectionReference } from 'firebase-admin/firestore';

@Injectable()
export class RepositoryService<T> {
  private readonly docRef: CollectionReference;
  constructor(
    private readonly firestore: Firestore,
    private readonly collection: string,
  ) {
    this.docRef = this.firestore.collection(collection);
  }

  async findAll(limit: number = 10): Promise<T[]> {
    const snapshot = await this.docRef
      .orderBy('fixture.date', 'desc')
      .limit(limit)
      .get();

    return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }) as T);
  }

  async findOneById(id: string): Promise<T | null> {
    const doc = await this.docRef.doc(id).get();

    if (!doc.exists) {
      return null;
    }

    return { id: doc.id, ...doc.data() } as T;
  }
}
