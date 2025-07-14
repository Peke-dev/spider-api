import { Injectable, ConflictException } from '@nestjs/common';
import { CreateMatchDto } from '../dto';
import {
  MatchEvent,
  MatchRepository,
  getMatchTypeByStatus,
} from '../../domain';

@Injectable()
export class CreateMatchUseCase {
  constructor(private readonly repository: MatchRepository) {}

  async execute(match: CreateMatchDto): Promise<string> {
    let matchEvents: MatchEvent[] = [];
    const existingMatch = await this.repository.findOneById(match.id);

    if (existingMatch) {
      throw new ConflictException(`Match with ID ${match.id} already exists`);
    }

    const { events } = match;

    if (events) {
      matchEvents = events.map((event) => {
        return new MatchEvent({
          ...event,
          matchId: match.id,
        });
      });
    }

    const date = new Date();

    return this.repository.create({
      ...match,
      status: {
        ...match.status,
        type: getMatchTypeByStatus(match.status.short),
      },
      events: matchEvents,
      createdAt: date,
      updatedAt: date,
    });
  }
}
