import {
  Controller,
  Post,
  Body,
  HttpCode,
  HttpStatus,
  UseGuards,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiBody,
} from '@nestjs/swagger';
import {
  CreateWebhookDto,
  CreateWebhookResponseDto,
} from '../../application/dto';
import { CreateWebhookUseCase } from '../../application/use-cases';
import { RequiredScopes } from '@modules/auth/infrastructure/decorators';
import { ScopesAuthGuard } from '@modules/auth/infrastructure/security/guards';
import { Scopes } from '@modules/auth/domain/enums';

@ApiTags('Webhooks')
@Controller('webhooks')
@UseGuards(ScopesAuthGuard)
@ApiBearerAuth()
export class CreateWebhookController {
  constructor(private readonly createWebhookUseCase: CreateWebhookUseCase) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @RequiredScopes(Scopes.WEBHOOKS_CREATE)
  @ApiOperation({
    summary: 'Create a new webhook',
    description:
      'Create a new webhook with URL, account ID, subscriptions, and optional request configuration. The webhook will be created with current timestamps.',
    operationId: 'Create Webhook',
  })
  @ApiBody({
    type: CreateWebhookDto,
    description: 'Webhook data to create',
  })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'The webhook has been successfully created.',
    type: CreateWebhookResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Invalid input data - Validation error in request body',
  })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    description:
      'Insufficient scopes - User does not have WEBHOOKS_CREATE permission',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Unauthorized - Invalid or missing authentication token',
  })
  @ApiResponse({
    status: HttpStatus.CONFLICT,
    description: 'Conflict - Webhook with the same ID already exists',
  })
  @ApiResponse({
    status: HttpStatus.UNPROCESSABLE_ENTITY,
    description: 'Unprocessable Entity - Validation error in request data',
  })
  async create(
    @Body() createWebhookDto: CreateWebhookDto,
  ): Promise<CreateWebhookResponseDto> {
    const id = await this.createWebhookUseCase.execute(createWebhookDto);
    return { id };
  }
}
