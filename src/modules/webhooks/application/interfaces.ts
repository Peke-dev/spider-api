export interface WebhookRequestOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  body?: any;
  timeout?: number;
  maxRetries?: number;
  retryDelay?: number;
}

export interface WebhookRequestResult<R> {
  success: boolean;
  statusCode?: number;
  response?: R;
  error?: string;
  attempts: number;
}
