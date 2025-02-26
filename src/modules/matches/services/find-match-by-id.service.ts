import { Injectable, Inject } from '@nestjs/common';

import { RepositoryInterface } from '@modules/database';

import { Match } from '../interfaces/match.interface';

@Injectable()
export class FindMatchByIdService {
  constructor(
    @Inject('matches')
    private readonly matchesRepository: RepositoryInterface<Match>,
  ) {}

  run(id: string): Promise<Match | null> {
    return this.matchesRepository.findOneById(id);
  }
}
