import { Injectable } from '@nestjs/common';
import { Match, MatchRepository } from '../../domain';

@Injectable()
export class FindAllMatchesUseCase {
  constructor(private readonly repository: MatchRepository) {}

  async execute(): Promise<Match[]> {
    return this.repository.findAll(
      {},
      {
        orderBy: 'date',
      },
    );
  }
}
