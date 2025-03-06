import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { Match } from '../../domain/entities';
import { MATCHES_COLLECTION } from '../../constants';
import { RepositoryInterface } from '@modules/database';

@Injectable()
export class FindMatchByIdUseCase {
  constructor(
    @Inject(MATCHES_COLLECTION)
    private readonly repository: RepositoryInterface<Match>,
  ) {}

  async execute(id: string): Promise<Match> {
    const match = await this.repository.findOneById(id);
    if (!match) {
      throw new NotFoundException('Match not found');
    }
    return match;
  }
}
