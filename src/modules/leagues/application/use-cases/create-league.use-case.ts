import { Injectable } from '@nestjs/common';

import { LeagueRepository } from '../../domain/repositories';
import { League, Season, Country } from '../../domain/entities';
import { CreateLeagueDto } from '../dto';

@Injectable()
export class CreateLeagueUseCase {
  constructor(private readonly repository: LeagueRepository) {}

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

    const res = await this.repository.create(league.toJSON());

    return res;
  }
}
