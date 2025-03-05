import { Injectable, NotFoundException } from '@nestjs/common';
import { Inject } from '@nestjs/common';
import { RepositoryInterface } from '@modules/database';
import { League } from '../../domain/entities';
import { LEAGUES_COLLECTION } from '../../constants';

@Injectable()
export class FindLeagueByIdUseCase {
  constructor(
    @Inject(LEAGUES_COLLECTION)
    private readonly repository: RepositoryInterface<League>,
  ) {}

  async execute(id: string): Promise<League> {
    const league = await this.repository.findOneById(id);

    if (!league) {
      throw new NotFoundException('League not found');
    }

    return league;
  }
}
