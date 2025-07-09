import { ApiProperty } from '@nestjs/swagger';
import { WebhookRequestDto } from './create-webhook.dto';

export class WebhookResponseDto {
  @ApiProperty({ example: '123e4567-e89b-12d3-a456-426614174000' })
  id: string;

  @ApiProperty({
    example: 'https://api.example.com/webhooks/events',
    description: 'The URL where webhook events will be sent',
  })
  url: string;

  @ApiProperty({
    example: '2024-01-15T10:30:00.000Z',
    description: 'Creation timestamp',
  })
  created: Date;

  @ApiProperty({
    example: '2024-01-15T10:30:00.000Z',
    description: 'Last update timestamp',
  })
  updated: Date;

  @ApiProperty({
    example: '123e4567-e89b-12d3-a456-426614174000',
    description: 'The account ID that owns this webhook',
  })
  accountId: string;

  @ApiProperty({
    example: ['matches.created', 'leagues.updated'],
    description: 'Array of event types to subscribe to',
  })
  subscriptions: string[];

  @ApiProperty({
    required: false,
    description:
      'Optional request configuration for headers and query parameters',
  })
  request?: WebhookRequestDto;
}
