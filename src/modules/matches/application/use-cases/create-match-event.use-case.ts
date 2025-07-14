import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateMatchEventDto } from '../dto';
import { MatchEvent, MatchRepository } from '../../domain';

@Injectable()
export class CreateMatchEventUseCase {
  constructor(private readonly repository: MatchRepository) {}

  async execute(
    matchId: string,
    eventData: CreateMatchEventDto,
  ): Promise<string> {
    const match = await this.repository.findOneById(matchId);

    if (!match) {
      throw new NotFoundException(`Match with ID ${matchId} not found`);
    }

    eventData.time.extra = eventData.time.extra || null;
    eventData.player.id = eventData.player.id || null;
    eventData.player.name = eventData.player.name || null;
    eventData.assist.id = eventData.assist.id || null;
    eventData.assist.name = eventData.assist.name || null;

    const newEvent = new MatchEvent({
      matchId,
      time: {
        elapsed: eventData.time.elapsed,
        extra: eventData.time.extra,
      },
      team: eventData.team,
      player: {
        id: eventData.player.id || null,
        name: eventData.player.name || null,
      },
      assist: {
        id: eventData.assist.id || null,
        name: eventData.assist.name || null,
      },
      type: eventData.type,
      detail: eventData.detail,
      comments: eventData.comments || null,
    });

    const currentEvents = match.events || [];

    if (currentEvents.some((event) => event.id === newEvent.id)) {
      return newEvent.id;
    }

    const updatedEvents = [...currentEvents, newEvent];

    await this.repository.update(matchId, {
      events: updatedEvents,
      updatedAt: new Date(),
    });

    return newEvent.id;
  }
}
