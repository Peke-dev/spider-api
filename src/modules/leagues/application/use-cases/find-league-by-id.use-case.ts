import { Injectable, NotFoundException } from '@nestjs/common';
import { League } from '../../domain/entities';
import { BaseRepository } from '@domain/repositories';

@Injectable()
export class FindLeagueByIdUseCase {
  constructor(private readonly repository: BaseRepository<League>) {}

  async execute(id: string): Promise<League> {
    const league = await this.repository.findOneById(id);

    if (!league) {
      throw new NotFoundException('League not found');
    }

    return league;
  }
}
