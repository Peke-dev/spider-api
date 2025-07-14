export const MATCH_EVENTS = {
  UPDATED: 'match.updated',
  EVENT_CREATED: 'match.event.created',
};

export type MatchEvents = (typeof MATCH_EVENTS)[keyof typeof MATCH_EVENTS];

export interface MatchUpdatedEvent {
  matchId: string;
}
