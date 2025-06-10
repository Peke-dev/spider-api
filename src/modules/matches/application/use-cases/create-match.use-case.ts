import { Injectable } from '@nestjs/common';
// import { Match } from '../../domain';
import { CreateMatchDto } from '../dto';
import { MatchRepository } from '../../domain';

@Injectable()
export class CreateMatchUseCase {
  constructor(private readonly repository: MatchRepository) {}

  async execute(match: CreateMatchDto): Promise<string> {
    const date = new Date();

    console.log('match', match);
    return this.repository.create({
      ...match,
      createdAt: date,
      updatedAt: date,
    });
  }
}
