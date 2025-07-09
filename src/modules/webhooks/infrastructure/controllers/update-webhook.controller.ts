import {
  Controller,
  Put,
  Param,
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
  ApiParam,
  ApiBody,
} from '@nestjs/swagger';
import {
  UpdateWebhookDto,
  UpdateWebhookResponseDto,
} from '../../application/dto';
import { UpdateWebhookUseCase } from '../../application/use-cases';
import { RequiredScopes } from '@modules/auth/infrastructure/decorators';
import { ScopesAuthGuard } from '@modules/auth/infrastructure/security/guards';
import { Scopes } from '@modules/auth/domain/enums';

@ApiTags('Webhooks')
@Controller('webhooks')
@UseGuards(ScopesAuthGuard)
@ApiBearerAuth()
export class UpdateWebhookController {
  constructor(private readonly updateWebhookUseCase: UpdateWebhookUseCase) {}

  @Put(':id')
  @HttpCode(HttpStatus.OK)
  @RequiredScopes(Scopes.WEBHOOKS_UPDATE)
  @ApiOperation({
    summary: 'Update a webhook',
    description:
      'Update an existing webhook with new information. Only the provided fields will be updated, keeping existing values for fields not included in the request. All fields are optional for partial updates.',
    operationId: 'Update Webhook',
  })
  @ApiParam({
    name: 'id',
    description: 'Unique identifier of the webhook to update (UUID format)',
    example: '123e4567-e89b-12d3-a456-426614174000',
    type: 'string',
  })
  @ApiBody({
    type: UpdateWebhookDto,
    description: 'Webhook data to update (all fields are optional)',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'The webhook has been successfully updated.',
    type: UpdateWebhookResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Invalid input data - Validation error in request body',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Webhook not found - The specified webhook ID does not exist',
  })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    description:
      'Insufficient scopes - User does not have WEBHOOKS_UPDATE permission',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Unauthorized - Invalid or missing authentication token',
  })
  @ApiResponse({
    status: HttpStatus.UNPROCESSABLE_ENTITY,
    description: 'Unprocessable Entity - Validation error in request data',
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description:
      'Internal Server Error - Database connection or processing error',
  })
  async update(
    @Param('id') id: string,
    @Body() updateWebhookDto: UpdateWebhookDto,
  ): Promise<UpdateWebhookResponseDto> {
    await this.updateWebhookUseCase.execute(id, updateWebhookDto);
    return { message: 'Webhook updated successfully' };
  }
}
