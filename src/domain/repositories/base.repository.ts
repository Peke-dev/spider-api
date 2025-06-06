export abstract class BaseRepository<T> {
  abstract findAll(query?: unknown, options?: unknown): Promise<T[]>;
  abstract findOneById(id: string): Promise<T | null>;
  abstract create(data: unknown): Promise<string>;
  abstract update(id: string, data: unknown): Promise<string>;
  abstract findOneBy(key: string, value: any): Promise<T | null>;
  abstract toDomain(data: unknown): T;
}
