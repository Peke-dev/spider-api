import { Injectable } from '@nestjs/common';
import { League } from '../../domain/entities';
import { BaseRepository } from '@domain/repositories';

@Injectable()
export class FindAllLeaguesUseCase {
  constructor(private readonly repository: BaseRepository<League>) {}

  execute(): Promise<League[]> {
    return this.repository.findAll({});
  }
}
