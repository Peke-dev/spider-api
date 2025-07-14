import { Injectable, NotFoundException } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { getObjectDifferences } from '@utils';

import {
  MatchRepository,
  MATCH_EVENTS,
  MatchUpdatedEvent,
  Match,
  MatchEvent,
  MatchTypeEnum,
} from '../../domain';
import { UpdateMatchDto } from '../dto';

@Injectable()
export class UpdateMatchUseCase {
  constructor(
    private readonly repository: MatchRepository,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  async execute(id: string, newData: UpdateMatchDto): Promise<string> {
    const match = await this.repository.findOneById(id);

    if (!match) {
      throw new NotFoundException(`Match with ID ${id} not found`);
    }

    let newMatchEvents: MatchEvent[] = [];

    if (newData.events) {
      newMatchEvents = newData.events.map((eventData, index) => {
        const n = new MatchEvent({
          ...match.events[index],
          ...eventData,
          matchId: match.id,
        });

        return n;
      });
    }

    const newMatch = new Match({
      ...match,
      periods: {
        ...match.periods,
        ...newData.periods,
      },
      status: {
        ...match.status,
        ...newData.status,
      },
      teams: {
        home: {
          ...match.teams.home,
          ...newData.teams?.home,
        },
        away: {
          ...match.teams.away,
          ...newData.teams?.away,
        },
      },
      venue: {
        ...match.venue,
        ...newData.venue,
      },
      score: newData.score || match.score,
      goals: newData.goals || match.goals,
      date: newData.date || match.date,
      timezone: newData.timezone || match.timezone,
      events: newMatchEvents,
      timestamp: newData.timestamp || match.timestamp,
      referee: newData.referee || match.referee,
      league: {
        ...match.league,
        ...newData.league,
      },
    });

    const differences = getObjectDifferences(match, newMatch, [
      'createdAt',
      'updatedAt',
      'date',
      'status.type',
      'id',
    ]);

    if (!differences || !differences.length) {
      return id;
    }

    const eventsDifferences = differences.some((diff) =>
      diff.path.includes('events'),
    );

    if (
      eventsDifferences &&
      newMatch.status.type === MatchTypeEnum.IN_PLAY &&
      newMatchEvents.length > match.events.length
    ) {
      const newEvents = newMatchEvents.filter(
        (event) => !match.eventExists(event),
      );

      newEvents.forEach((event) => {
        this.eventEmitter.emit(MATCH_EVENTS.EVENT_CREATED, {
          id: event.id,
          matchId: id,
        });
      });
    }

    await this.repository.update(id, {
      ...newMatch,
      updatedAt: new Date(),
    });

    const event: MatchUpdatedEvent = {
      matchId: id,
    };
    this.eventEmitter.emit(MATCH_EVENTS.UPDATED, event);

    return id;
  }
}
