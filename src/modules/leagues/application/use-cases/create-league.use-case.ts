import { Injectable } from '@nestjs/common';
import { Inject } from '@nestjs/common';

import { RepositoryInterface } from '@modules/database';
import { League } from '../../domain/entities/league.entity';
import { LEAGUES_COLLECTION } from '../../constants';
import { CreateLeagueDto } from '../dto';

@Injectable()
export class CreateLeagueUseCase {
  constructor(
    @Inject(LEAGUES_COLLECTION)
    private readonly repository: RepositoryInterface<League>,
  ) {}

  async execute(data: CreateLeagueDto): Promise<string> {
    const league = new League({
      name: data.name,
      country: {
        name: data.country,
        code: null,
        flag: null,
      },
      logo: data.logo,
      type: data.type,
      seasons: data.seasons,
    });

    return this.repository.create(league);
  }
}
