import { Injectable, NotFoundException } from '@nestjs/common';
import { MatchRepository, getMatchTypeByStatus } from '../../domain';
import { UpdateMatchDto } from '../dto';

@Injectable()
export class UpdateMatchUseCase {
  constructor(private readonly repository: MatchRepository) {}

  async execute(id: string, match: UpdateMatchDto): Promise<void> {
    const existingMatch = await this.repository.findOneById(id);

    if (!existingMatch) {
      throw new NotFoundException(`Match with ID ${id} not found`);
    }

    let status = match.status;

    if (status && status.short) {
      status = {
        ...status,
        type: getMatchTypeByStatus(status.short),
      };
    }

    const date = new Date();
    await this.repository.update(id, {
      ...match,
      status,
      updatedAt: date,
    });
  }
}
