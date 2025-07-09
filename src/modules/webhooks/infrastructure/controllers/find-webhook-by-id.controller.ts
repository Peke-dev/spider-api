import {
  Controller,
  Get,
  Param,
  HttpCode,
  HttpStatus,
  UseGuards,
  NotFoundException,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiParam,
} from '@nestjs/swagger';
import { WebhookResponseDto } from '../../application/dto';
import { FindWebhookByIdUseCase } from '../../application/use-cases';
import { RequiredScopes } from '@modules/auth/infrastructure/decorators';
import { ScopesAuthGuard } from '@modules/auth/infrastructure/security/guards';
import { Scopes } from '@modules/auth/domain/enums';

@ApiTags('Webhooks')
@Controller('webhooks')
@UseGuards(ScopesAuthGuard)
@ApiBearerAuth()
export class FindWebhookByIdController {
  constructor(
    private readonly findWebhookByIdUseCase: FindWebhookByIdUseCase,
  ) {}

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @RequiredScopes(Scopes.WEBHOOKS_READ)
  @ApiOperation({
    summary: 'Get a webhook by ID',
    description:
      'Retrieve detailed information about a specific webhook using its unique identifier. Returns complete webhook data including URL, account ID, subscriptions, and timestamps.',
    operationId: 'Find Webhook By Id',
  })
  @ApiParam({
    name: 'id',
    description: 'Unique identifier of the webhook (UUID format)',
    example: '123e4567-e89b-12d3-a456-426614174000',
    type: 'string',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Webhook found and returned successfully.',
    type: WebhookResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Webhook not found - The specified webhook ID does not exist',
  })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    description:
      'Insufficient scopes - User does not have WEBHOOKS_READ permission',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Unauthorized - Invalid or missing authentication token',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Bad Request - Invalid webhook ID format',
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description:
      'Internal Server Error - Database connection or processing error',
  })
  async findOne(@Param('id') id: string): Promise<WebhookResponseDto> {
    const webhook = await this.findWebhookByIdUseCase.execute(id);

    if (!webhook) {
      throw new NotFoundException(`Webhook with ID ${id} not found`);
    }

    return webhook;
  }
}
