export interface RepositoryInterface<T> {
  findAll(): Promise<T[]>;
  findOneById(id: string): Promise<T | null>;
}
