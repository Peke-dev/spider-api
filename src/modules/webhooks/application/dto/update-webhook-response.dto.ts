import { ApiProperty } from '@nestjs/swagger';

export class UpdateWebhookResponseDto {
  @ApiProperty({ example: 'Webhook updated successfully' })
  message: string;
}
