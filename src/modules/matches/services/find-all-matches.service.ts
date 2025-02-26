import { Inject, Injectable } from '@nestjs/common';

import { RepositoryInterface } from '@modules/database';

import { Match } from '../interfaces/match.interface';

@Injectable()
export class FindAllMatchesService {
  constructor(
    @Inject('matches')
    private readonly matchesRepository: RepositoryInterface<Match>,
  ) {}

  run(): Promise<Match[]> {
    return this.matchesRepository.findAll();
  }
}
