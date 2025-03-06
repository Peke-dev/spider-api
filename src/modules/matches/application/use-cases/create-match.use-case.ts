import { Injectable, Inject } from '@nestjs/common';
import { Match } from '../../domain';
import { MATCHES_COLLECTION } from '../../constants';
import { RepositoryInterface } from '@modules/database';

@Injectable()
export class CreateMatchUseCase {
  constructor(
    @Inject(MATCHES_COLLECTION)
    private readonly repository: RepositoryInterface<Match>,
  ) {}

  async execute(match: Partial<Match>): Promise<string> {
    return this.repository.create(match);
  }
}
