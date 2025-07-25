import { Model, QueryOptions } from 'mongoose';

import { MongooseRepository as BaseRepository } from '@infrastructure/repositories';

import { Match, MatchDto } from '../../domain/entities';
import { MatchDocument } from '../schemas';
import { FindAllOptionsDto } from '@application/dtos';

export class MatchMongooseRepository extends BaseRepository<
  MatchDocument,
  Match
> {
  constructor(private readonly matchModel: Model<MatchDocument>) {
    super(matchModel);
  }

  async findAll(
    query?: QueryOptions<MatchDocument>,
    options?: FindAllOptionsDto,
  ): Promise<Match[]> {
    const skip = options?.skip ?? 0;
    const limit = options?.limit ?? 20;
    return (
      await this.matchModel
        .find(query || {})
        .skip(skip)
        .limit(limit)
        .exec()
    ).map((doc) => this.toDomain(doc));
  }

  async count(query?: QueryOptions<MatchDocument>): Promise<number> {
    return this.matchModel.countDocuments(query || {}).exec();
  }

  toDomain(match: MatchDocument): Match {
    const data = match.toJSON();
    return new Match(data as MatchDto);
  }
}
