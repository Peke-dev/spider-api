import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsString,
  IsArray,
  IsOptional,
  IsUrl,
} from 'class-validator';

export interface WebhookRequestDto {
  headers?: Record<string, any>;
  query?: Record<string, any>;
}

export class CreateWebhookDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: '123e4567-e89b-12d3-a456-426614174000' })
  id: string;

  @IsUrl()
  @IsNotEmpty()
  @ApiProperty({
    example: 'https://api.example.com/webhooks/events',
    description: 'The URL where webhook events will be sent',
  })
  url: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    example: '123e4567-e89b-12d3-a456-426614174000',
    description: 'The account ID that owns this webhook',
  })
  accountId: string;

  @IsArray()
  @IsString({ each: true })
  @IsNotEmpty()
  @ApiProperty({
    example: ['matches.created', 'leagues.updated'],
    description: 'Array of event types to subscribe to',
  })
  subscriptions: string[];

  @IsOptional()
  @ApiProperty({
    required: false,
    description:
      'Optional request configuration for headers and query parameters',
  })
  request?: WebhookRequestDto;
}
