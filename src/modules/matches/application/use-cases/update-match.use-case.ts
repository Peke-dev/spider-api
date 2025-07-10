import { Injectable, NotFoundException } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { getObjectDifferences } from '@utils';

import {
  MatchRepository,
  getMatchTypeByStatus,
  MATCH_EVENTS,
  MatchUpdatedEvent,
} from '../../domain';
import { UpdateMatchDto } from '../dto';

@Injectable()
export class UpdateMatchUseCase {
  constructor(
    private readonly repository: MatchRepository,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  async execute(id: string, newData: UpdateMatchDto): Promise<string> {
    const existingMatch = await this.repository.findOneById(id);

    if (!existingMatch) {
      throw new NotFoundException(`Match with ID ${id} not found`);
    }

    const differences = getObjectDifferences(newData, existingMatch, [
      'createdAt',
      'updatedAt',
      'date',
      'status.type',
      'id',
    ]);

    if (!differences || !differences.length) {
      return id;
    }

    let status = newData.status;

    if (status && status.short) {
      status = {
        ...status,
        type: getMatchTypeByStatus(status.short),
      };
    }

    const matchUpdated = await this.repository.update(id, {
      ...newData,
      status,
      updatedAt: new Date(),
    });

    // Emit match updated event
    const event: MatchUpdatedEvent = {
      matchId: id,
    };
    this.eventEmitter.emit(MATCH_EVENTS.MATCH_UPDATED, event);

    return matchUpdated;
  }
}
