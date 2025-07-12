export const MATCH_EVENTS = {
  MATCH_UPDATED: 'match.updated',
};

export type MatchEvents = (typeof MATCH_EVENTS)[keyof typeof MATCH_EVENTS];

export interface MatchUpdatedEvent {
  matchId: string;
}
