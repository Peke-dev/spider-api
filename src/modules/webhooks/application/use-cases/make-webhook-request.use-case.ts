import { Injectable, Logger } from '@nestjs/common';
import { WebhookRepository } from '../../domain/repositories';
import { Webhook } from '../../domain/entities';
import axios, { AxiosRequestConfig } from 'axios';
import { WebhookRequestOptions, WebhookRequestResult } from '../interfaces';

@Injectable()
export class MakeWebhookRequestUseCase {
  private readonly logger = new Logger(MakeWebhookRequestUseCase.name);

  constructor(private readonly webhookRepository: WebhookRepository) {}

  async execute<R>(
    webhookId: string,
    options: WebhookRequestOptions = {},
  ): Promise<WebhookRequestResult<R>> {
    const {
      method = 'POST',
      body = {},
      timeout = 20000, // 20 seconds
      maxRetries = 3,
      retryDelay = 20000, // 20 seconds
    } = options;

    // Find the webhook
    const webhook = await this.webhookRepository.findById(webhookId);
    if (!webhook) {
      throw new Error(`Webhook with ID ${webhookId} not found`);
    }

    let lastError: Error | null = null;
    let attempts = 0;

    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      attempts = attempt;
      try {
        this.logger.log(
          `Making webhook request to ${webhook.url} (attempt ${attempt}/${maxRetries})`,
        );

        const response = await this.makeRequest(webhook, method, body, timeout);

        this.logger.log(
          `Webhook request successful to ${webhook.url} (attempt ${attempt})`,
        );

        return {
          success: true,
          statusCode: response.status,
          response: response.data,
          attempts,
        };
      } catch (error) {
        lastError = error as Error;
        this.logger.warn(
          `Webhook request failed to ${webhook.url} (attempt ${attempt}/${maxRetries}): ${error.message}`,
        );

        if (attempt < maxRetries) {
          this.logger.log(
            `Retrying webhook request to ${webhook.url} in ${retryDelay}ms`,
          );
          await this.delay(retryDelay);
        }
      }
    }

    this.logger.error(
      `Webhook request failed to ${webhook.url} after ${maxRetries} attempts`,
    );

    return {
      success: false,
      error: lastError?.message || 'Unknown error',
      attempts,
    };
  }

  private async makeRequest(
    webhook: Webhook,
    method: string,
    body: any,
    timeout: number,
  ): Promise<any> {
    const url = new URL(webhook.url);

    // Add query parameters from webhook if they exist
    if (webhook.request?.query) {
      Object.entries(webhook.request.query).forEach(([key, value]) => {
        url.searchParams.append(key, String(value));
      });
    }

    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      'User-Agent': 'Spider-API-Webhook/1.0',
    };

    // Add headers from webhook if they exist
    if (webhook.request?.headers) {
      Object.entries(webhook.request.headers).forEach(([key, value]) => {
        headers[key] = String(value);
      });
    }

    const axiosConfig: AxiosRequestConfig = {
      url: url.toString(),
      method: method as any,
      headers,
      timeout,
      data: method !== 'GET' ? body : undefined,
      params: undefined, // params are ya in URL
      validateStatus: () => true, // We'll handle status manually
    };

    try {
      const response = await axios(axiosConfig);

      if (!(response.status >= 200 && response.status < 300)) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      return {
        status: response.status,
        data: response.data,
      };
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.code === 'ECONNABORTED') {
          throw new Error('Request timeout');
        }

        if (error.response) {
          throw new Error(
            `HTTP ${error.response.status}: ${error.response.statusText}`,
          );
        }

        throw new Error(error.message);
      }

      if (error instanceof Error) {
        throw error;
      }

      throw new Error('Unknown error occurred');
    }
  }

  private delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}
