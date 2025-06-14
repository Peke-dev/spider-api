import { Injectable, NotFoundException } from '@nestjs/common';
import { MatchRepository } from '../../domain';
import { UpdateMatchDto } from '../dto';

@Injectable()
export class UpdateMatchUseCase {
  constructor(private readonly repository: MatchRepository) {}

  async execute(id: string, match: UpdateMatchDto): Promise<void> {
    const existingMatch = await this.repository.findOneById(id);

    if (!existingMatch) {
      throw new NotFoundException(`Match with ID ${id} not found`);
    }

    const date = new Date();
    await this.repository.update(id, {
      ...match,
      updatedAt: date,
    });
  }
}
