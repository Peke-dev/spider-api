import { Injectable } from '@nestjs/common';
import { Inject } from '@nestjs/common';
import { RepositoryInterface } from '@modules/database';
import { League } from '../../domain/entities';
import { LEAGUES_COLLECTION } from '../../constants';

@Injectable()
export class FindAllLeaguesUseCase {
  constructor(
    @Inject(LEAGUES_COLLECTION)
    private readonly repository: RepositoryInterface<League>,
  ) {}

  async execute(): Promise<League[]> {
    return this.repository.findAll();
  }
}
