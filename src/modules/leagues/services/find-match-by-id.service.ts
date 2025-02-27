import { Injectable, Inject } from '@nestjs/common';

import { RepositoryInterface } from '@modules/database';

import { League } from '../entities/league.entity';
import { LEAGUES_COLLECTION } from '../constants';

@Injectable()
export class FindLeagueByIdService {
  constructor(
    @Inject(LEAGUES_COLLECTION)
    private readonly leaguesRepository: RepositoryInterface<League>,
  ) {}

  run(id: string): Promise<League | null> {
    return this.leaguesRepository.findOneById(id);
  }
}
