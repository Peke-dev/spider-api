export enum SubscriptionType {
  LEAGUE = 'leagues',
  MATCH = 'matches',
}

export interface ChatSubscriptions {
  leagues: string[];
  matches: string[];
}
