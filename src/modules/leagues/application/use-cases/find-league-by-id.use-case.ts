import { Injectable, NotFoundException } from '@nestjs/common';

import { League } from '../../domain/entities';
import { LeagueRepository } from '../../domain/repositories';

@Injectable()
export class FindLeagueByIdUseCase {
  constructor(private readonly repository: LeagueRepository) {}

  async execute(id: string): Promise<League> {
    const league = await this.repository.findOneById(id);

    console.log('league', league);

    if (!league) {
      throw new NotFoundException('League not found');
    }

    return league;
  }
}
