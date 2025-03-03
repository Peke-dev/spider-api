export interface FindAllOptionsInterface {
  orderBy?: string;
  order?: 'asc' | 'desc';
}

export interface RepositoryInterface<T> {
  findAll(options?: FindAllOptionsInterface): Promise<T[]>;
  findOneById(id: string): Promise<T | null>;
  create(data: any): Promise<string>;
  update(id: string, data: any): Promise<string>;
  findOneBy(key: string, value: any): Promise<T | null>;
}
