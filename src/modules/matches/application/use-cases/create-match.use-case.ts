import { Injectable, ConflictException } from '@nestjs/common';
import { CreateMatchDto } from '../dto';
import { MatchRepository } from '../../domain';

@Injectable()
export class CreateMatchUseCase {
  constructor(private readonly repository: MatchRepository) {}

  async execute(match: CreateMatchDto): Promise<string> {
    const existingMatch = await this.repository.findOneById(match.id);

    if (existingMatch) {
      throw new ConflictException(`Match with ID ${match.id} already exists`);
    }

    const date = new Date();

    return this.repository.create({
      ...match,
      createdAt: date,
      updatedAt: date,
    });
  }
}
