import { Controller, Post, Body, Param, UseGuards } from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiParam,
} from '@nestjs/swagger';
import {
  CreateMatchEventDto,
  CreateMatchEventResponseDto,
  ErrorResponseDto,
} from '../../application/dto';
import { CreateMatchEventUseCase } from '../../application';
import { RequiredScopes } from '@modules/auth/infrastructure/decorators';
import { ScopesAuthGuard } from '@modules/auth/infrastructure/security/guards';
import { Scopes } from '@modules/auth/domain/enums';

@ApiTags('Matches')
@Controller('matches')
@UseGuards(ScopesAuthGuard)
@ApiBearerAuth()
export class CreateMatchEventController {
  constructor(
    private readonly createMatchEventUseCase: CreateMatchEventUseCase,
  ) {}

  @Post(':matchId/events')
  @RequiredScopes(Scopes.MATCHES_EVENTS_CREATE)
  @ApiParam({
    name: 'matchId',
    description: 'ID of the match to add event to',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiOperation({
    summary: 'Create a new match event',
    description:
      'Create a new event for a specific match. The event will be added to the match.events array. The event ID is automatically generated using UUID v5 based on the elapsed time.',
    operationId: 'Create Match Event',
  })
  @ApiResponse({
    status: 201,
    description: 'Match event created successfully',
    type: CreateMatchEventResponseDto,
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - Invalid or missing authentication token',
    type: ErrorResponseDto,
  })
  @ApiResponse({
    status: 403,
    description:
      'Forbidden - Insufficient scopes - User does not have MATCHES_EVENTS_CREATE permission',
    type: ErrorResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Match not found - The specified match ID does not exist',
    type: ErrorResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Bad Request - Invalid request data',
    type: ErrorResponseDto,
  })
  @ApiResponse({
    status: 422,
    description: 'Unprocessable Entity - Validation error in request data',
    type: ErrorResponseDto,
  })
  async create(
    @Param('matchId') matchId: string,
    @Body() createMatchEventDto: CreateMatchEventDto,
  ): Promise<CreateMatchEventResponseDto> {
    const eventId = await this.createMatchEventUseCase.execute(
      matchId,
      createMatchEventDto,
    );

    return {
      id: eventId,
      message: 'Match event created successfully',
    };
  }
}
