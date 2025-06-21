import { Injectable } from '@nestjs/common';
import { Match, MatchRepository } from '../../domain';
import { FindMatchesQueryDto } from '../dto';

@Injectable()
export class FindAllMatchesUseCase {
  constructor(private readonly repository: MatchRepository) {}

  async execute(queryParams: FindMatchesQueryDto = {}): Promise<Match[]> {
    const { statusType, status, league } = queryParams;

    const query = {};

    if (league) {
      query['league.id'] = league;
    }

    if (statusType) {
      query['status.type'] = statusType;
    }

    if (status) {
      query['status.short'] = status;
    }

    return this.repository.findAll(query, {
      orderBy: 'date',
    });
  }
}
