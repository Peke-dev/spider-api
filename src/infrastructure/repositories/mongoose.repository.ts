import { Model, Document, QueryOptions } from 'mongoose';

import { FindAllOptionsDto } from '../../application/dtos';
import { BaseRepository } from '../../domain/repositories';

export class MongooseRepository<T extends Document, D>
  implements BaseRepository<D>
{
  constructor(private readonly model: Model<T>) {}

  async findAll(
    query?: QueryOptions<T>,
    options?: FindAllOptionsDto,
  ): Promise<D[]> {
    const { orderBy = 'createdAt', order = 'desc' } = options || {};

    const documents = await this.model
      .find(query || {})
      .sort({ [orderBy]: order === 'desc' ? -1 : 1 })
      .exec();

    return documents.map((doc) => this.toDomain(doc));
  }

  async findOneById(id: string): Promise<D | null> {
    const document = await this.model.findOne({ id }).exec();
    return document ? this.toDomain(document) : null;
  }

  async findOneBy(key: string, value: any): Promise<D | null> {
    const query: Record<string, any> = {};
    query[key] = value;

    const document = await this.model.findOne(query).exec();
    return document ? this.toDomain(document.toJSON()) : null;
  }

  async create(data): Promise<string> {
    const document = new this.model(data);

    const savedDocument = await document.save();
    return savedDocument.id;
  }

  async update(id: string, data: Partial<T>): Promise<string> {
    await this.model
      .findOneAndUpdate(
        { id },
        {
          ...data,
          updatedAt: new Date(),
        },
        { new: true },
      )
      .exec();

    return id;
  }

  async count(query?: QueryOptions<T>): Promise<number> {
    return this.model.countDocuments(query || {}).exec();
  }

  toDomain(_data: Document): D {
    throw new Error('Method toDomain not implemented');
  }
}
