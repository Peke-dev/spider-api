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
    return await super.findAll(query || {}, options);
  }

  toDomain(match: MatchDocument): Match {
    const data = match.toJSON();
    return new Match(data as MatchDto);
  }
}
