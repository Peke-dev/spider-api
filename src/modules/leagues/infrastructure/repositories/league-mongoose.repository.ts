import { Model } from 'mongoose';

import { MongooseRepository as BaseRepository } from '@infrastructure/repositories';

import { League, Country, Season } from '../../domain/entities';
import { LeagueDocument } from '../schemas';

export class LeagueMongooseRepository extends BaseRepository<
  LeagueDocument,
  League
> {
  constructor(private readonly leagueModel: Model<LeagueDocument>) {
    super(leagueModel);
  }

  toDomain(league: LeagueDocument): League {
    const data = league.toJSON();
    return new League({
      ...data,
      country: new Country(data.country),
      seasons: data.seasons.map((season: any) => new Season(season)),
    });
  }
}
