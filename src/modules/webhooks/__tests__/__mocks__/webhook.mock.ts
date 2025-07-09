import { Webhook } from '@modules/webhooks/domain/entities';

export interface WebhookMockData {
  id?: string;
  url?: string;
  accountId?: string;
  subscriptions?: string[];
  request?: {
    headers?: Record<string, any>;
    query?: Record<string, any>;
  };
  created?: Date;
  updated?: Date;
}

export const createMockWebhook = (data: WebhookMockData = {}): Webhook => {
  const defaultData = {
    id: '123e4567-e89b-12d3-a456-426614174000',
    url: 'https://api.example.com/webhooks/events',
    accountId: '123e4567-e89b-12d3-a456-426614174001',
    subscriptions: ['matches.created', 'leagues.updated'],
    request: {
      headers: {
        'Content-Type': 'application/json',
        'X-API-Key': 'secret-key',
      },
      query: {
        version: 'v1',
      },
    },
    created: new Date(),
    updated: new Date(),
  };

  return new Webhook({
    ...defaultData,
    ...data,
  });
};

export const mockWebhook = createMockWebhook();

export const createMockWebhooks = (count: number): Webhook[] => {
  return Array.from({ length: count }, (_, index) =>
    createMockWebhook({
      id: `webhook-${index + 1}`,
      url: `https://api.example.com/webhooks/events-${index + 1}`,
      accountId: `account-${index + 1}`,
      subscriptions: [`event.${index + 1}`, `event.${index + 2}`],
      request: {
        headers: {
          'Content-Type': 'application/json',
          'X-API-Key': `secret-key-${index + 1}`,
        },
        query: {
          version: `v${index + 1}`,
        },
      },
      created: new Date(),
      updated: new Date(),
    }),
  );
};
