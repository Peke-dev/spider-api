import { Injectable } from '@nestjs/common';
import { League } from '../../domain/entities';
import { LeagueRepository } from '../../domain/repositories';

@Injectable()
export class FindAllLeaguesUseCase {
  constructor(private readonly repository: LeagueRepository) {}

  execute(params?: { status: string }): Promise<League[]> {
    return this.repository.findAll(params);
  }
}
