import { FindAllOptionsDto } from '@application/dtos';

export abstract class BaseRepository<T> {
  abstract findAll(options?: FindAllOptionsDto): Promise<T[]>;
  abstract findOneById(id: string): Promise<T | null>;
  abstract create<CreateDTO>(data: CreateDTO): Promise<string>;
  abstract update(id: string, data: any): Promise<string>;
  abstract findOneBy(key: string, value: any): Promise<T | null>;
}
