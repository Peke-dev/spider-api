import { Injectable, Inject } from '@nestjs/common';
import { Match } from '../../domain/entities';
import { MATCHES_COLLECTION } from '../../constants';
import { RepositoryInterface } from '@modules/database';
@Injectable()
export class FindAllMatchesUseCase {
  constructor(
    @Inject(MATCHES_COLLECTION)
    private readonly repository: RepositoryInterface<Match>,
  ) {}

  async execute(): Promise<Match[]> {
    return this.repository.findAll();
  }
}
