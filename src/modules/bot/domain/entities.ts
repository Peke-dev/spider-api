import { ChatSubscriptions } from './interfaces';

export interface ChatProps {
  id: number;
  timezone?: string;
  language?: string;
  subscriptions?: {
    leagues: string[];
    matches: string[];
  };
}

export class Chat {
  id: number;
  timezone: string;
  language: string;
  subscriptions: ChatSubscriptions;

  constructor(props: ChatProps) {
    this.id = props.id;
    this.timezone = props.timezone || 'utc';
    this.language = props.language || 'es';
    this.subscriptions = props.subscriptions || {
      leagues: [],
      matches: [],
    };
  }
}
