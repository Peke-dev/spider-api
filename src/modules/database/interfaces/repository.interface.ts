export interface FindAllOptionsInterface {
  orderBy?: string;
  order?: 'asc' | 'desc';
}

export interface RepositoryInterface<T> {
  findAll(options?: FindAllOptionsInterface): Promise<T[]>;
  findOneById(id: string): Promise<T | null>;
}
