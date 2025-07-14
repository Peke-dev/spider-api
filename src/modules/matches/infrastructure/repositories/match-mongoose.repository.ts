import { Model } from 'mongoose';

import { MongooseRepository as BaseRepository } from '@infrastructure/repositories';

import { Match, MatchDto } from '../../domain/entities';
import { MatchDocument } from '../schemas';

export class MatchMongooseRepository extends BaseRepository<
  MatchDocument,
  Match
> {
  constructor(private readonly matchModel: Model<MatchDocument>) {
    super(matchModel);
  }

  toDomain(match: MatchDocument): Match {
    const data = match.toJSON();
    return new Match(data as MatchDto);
  }
}
