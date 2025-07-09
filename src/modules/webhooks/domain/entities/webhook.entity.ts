export interface WebhookRequest {
  headers?: Record<string, any>;
  query?: Record<string, any>;
}

export class Webhook {
  id: string;
  url: string;
  created: Date;
  updated: Date;
  accountId: string;
  subscriptions: string[];
  request?: WebhookRequest;

  constructor(props: Partial<Webhook>) {
    Object.assign(this, props);
  }
}
