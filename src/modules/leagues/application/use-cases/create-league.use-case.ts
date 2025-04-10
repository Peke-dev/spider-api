import { Injectable } from '@nestjs/common';
import { Inject } from '@nestjs/common';

import { RepositoryInterface } from '@modules/database';
import { League, Season, Country } from '../../domain/entities';
import { LEAGUES_COLLECTION } from '../../constants';
import { CreateLeagueDto } from '../dto';

@Injectable()
export class CreateLeagueUseCase {
  constructor(
    @Inject(LEAGUES_COLLECTION)
    private readonly repository: RepositoryInterface<League>,
  ) {}

  async execute(data: CreateLeagueDto): Promise<string> {
    const country = new Country(data.country);

    const seasons = data.seasons.map(
      (season) =>
        new Season({
          current: season.current,
          year: season.year,
          start: season.start,
          end: season.end,
        }),
    );

    const league = new League({
      id: data.id,
      name: data.name,
      logo: data.logo,
      type: data.type,
      country,
      seasons,
    });

    return this.repository.create(league.toJSON());
  }
}
