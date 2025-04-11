import { Model, Document } from 'mongoose';

import { FindAllOptionsDto } from '../../application/dtos';
import { BaseRepository } from '../../domain/repositories';

export class MongooseRepository<T extends Document, D>
  implements BaseRepository<D>
{
  constructor(private readonly model: Model<T>) {}

  async findAll(options?: FindAllOptionsDto): Promise<D[]> {
    const { orderBy = 'createdAt', order = 'desc' } = options || {};

    const documents = await this.model
      .find()
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

  async create<CreateDTO>(data: CreateDTO & { id: string }): Promise<string> {
    console.log('data', data);
    const document = new this.model(data);

    const savedDocument = await document.save();
    return savedDocument.id;
  }

  async update(id: string, data: Partial<T>): Promise<string> {
    await this.model
      .findByIdAndUpdate(
        id,
        {
          ...data,
          updatedAt: new Date(),
        },
        { new: true },
      )
      .exec();

    return id;
  }

  toDomain(data: Document): D {
    console.error('Not implemented');
    return data as D;
  }
}
