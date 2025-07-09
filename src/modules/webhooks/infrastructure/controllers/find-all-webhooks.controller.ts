import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  UseGuards,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { WebhookResponseDto } from '../../application/dto';
import { FindAllWebhooksUseCase } from '../../application/use-cases';
import { RequiredScopes } from '@modules/auth/infrastructure/decorators';
import { ScopesAuthGuard } from '@modules/auth/infrastructure/security/guards';
import { Scopes } from '@modules/auth/domain/enums';

@ApiTags('Webhooks')
@Controller('webhooks')
@UseGuards(ScopesAuthGuard)
@ApiBearerAuth()
export class FindAllWebhooksController {
  constructor(
    private readonly findAllWebhooksUseCase: FindAllWebhooksUseCase,
  ) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  @RequiredScopes(Scopes.WEBHOOKS_LIST)
  @ApiOperation({
    summary: 'Get all webhooks',
    description:
      'Retrieve a list of all webhooks with their complete information including URL, account ID, subscriptions, and timestamps.',
    operationId: 'Find All Webhooks',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'List of webhooks retrieved successfully.',
    type: [WebhookResponseDto],
  })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    description:
      'Insufficient scopes - User does not have WEBHOOKS_LIST permission',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Unauthorized - Invalid or missing authentication token',
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description:
      'Internal Server Error - Database connection or processing error',
  })
  async findAll(): Promise<WebhookResponseDto[]> {
    return this.findAllWebhooksUseCase.execute();
  }
}
