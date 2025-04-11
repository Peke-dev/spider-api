import { CollectionReference } from 'firebase-admin/firestore';

import { FindAllOptionsDto } from '../../application/dtos';
import { BaseRepository } from '../../domain/repositories';

export class FirestoreRepository<T> implements BaseRepository<T> {
  constructor(private readonly collectionRef: CollectionReference) {}

  async findAll(options: FindAllOptionsDto = {}): Promise<T[]> {
    const { orderBy = 'createdAt', order = 'desc' } = options;

    const snapshot = await this.collectionRef.orderBy(orderBy, order).get();

    return snapshot.docs.map((doc) => {
      const data = { id: doc.id, ...doc.data() };
      return this.toDomain(data);
    });
  }

  async findOneById(id: string): Promise<T | null> {
    const doc = await this.collectionRef.doc(id).get();

    if (!doc.exists) {
      return null;
    }

    const data = { id: doc.id, ...doc.data() };

    return this.toDomain(data);
  }

  async findOneBy(key: string, value: any): Promise<T | null> {
    const snapshot = await this.collectionRef
      .where(key, '==', value)
      .limit(1)
      .get();

    if (snapshot.empty) {
      return null;
    }

    const [doc] = snapshot.docs;

    const data = { id: doc.id, ...doc.data() };

    return this.toDomain(data);
  }

  async create<CreateDTO>(data: CreateDTO & { id: string }): Promise<string> {
    const { id } = data;

    if (!id) {
      throw new Error('Id is required');
    }

    const docRef = this.collectionRef.doc(id);
    const timestamp = new Date();

    await docRef.set({
      ...data,
      id,
      createdAt: timestamp,
      updatedAt: timestamp,
    });

    return id;
  }

  async update(id: string, data: Partial<T>): Promise<string> {
    const docRef = this.collectionRef.doc(id);
    const timestamp = new Date();

    await docRef.update({
      ...data,
      updatedAt: timestamp,
    } as Record<string, any>);

    return id;
  }

  toDomain(data: any): T {
    console.error('Not implemented');
    return data;
  }
}
