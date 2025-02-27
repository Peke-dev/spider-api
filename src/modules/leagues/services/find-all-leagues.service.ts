import { Inject, Injectable } from '@nestjs/common';

import { RepositoryInterface } from '@modules/database';

import { League } from '../entities/league.entity';
import { LEAGUES_COLLECTION } from '../constants';

@Injectable()
export class FindAllLeaguesService {
  constructor(
    @Inject(LEAGUES_COLLECTION)
    private readonly leaguesRepository: RepositoryInterface<League>,
  ) {}

  run(): Promise<League[]> {
    return this.leaguesRepository.findAll();
  }
}
