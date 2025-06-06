import { Injectable, NotFoundException } from '@nestjs/common';

import { LeagueRepository } from '../../domain/repositories';
import { League, Season, Country } from '../../domain/entities';
import { UpdateLeagueDto } from '../dto';

@Injectable()
export class UpdateLeagueUseCase {
  constructor(private readonly repository: LeagueRepository) {}

  async execute(id: string, data: UpdateLeagueDto): Promise<void> {
    const leagueData = await this.repository.findOneById(id);

    if (!leagueData) {
      throw new NotFoundException('League not found');
    }

    await this.repository.update(id, data);
  }
}
