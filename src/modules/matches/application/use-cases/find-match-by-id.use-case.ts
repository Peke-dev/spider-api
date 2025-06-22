import { Injectable } from '@nestjs/common';
import { Match, MatchRepository } from '../../domain';

@Injectable()
export class FindMatchByIdUseCase {
  constructor(private readonly repository: MatchRepository) {}

  async execute(id: string): Promise<Match | null> {
    return this.repository.findOneById(id);
  }
}
