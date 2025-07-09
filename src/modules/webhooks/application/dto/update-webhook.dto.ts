import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, IsArray, IsUrl } from 'class-validator';
import { WebhookRequestDto } from './create-webhook.dto';

export class UpdateWebhookDto {
  @IsOptional()
  @IsUrl()
  @ApiProperty({
    example: 'https://api.example.com/webhooks/events',
    description: 'The URL where webhook events will be sent',
    required: false,
  })
  url?: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    example: '123e4567-e89b-12d3-a456-426614174000',
    description: 'The account ID that owns this webhook',
    required: false,
  })
  accountId?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  @ApiProperty({
    example: ['matches.created', 'leagues.updated'],
    description: 'Array of event types to subscribe to',
    required: false,
  })
  subscriptions?: string[];

  @IsOptional()
  @ApiProperty({
    required: false,
    description:
      'Optional request configuration for headers and query parameters',
  })
  request?: WebhookRequestDto;
}
