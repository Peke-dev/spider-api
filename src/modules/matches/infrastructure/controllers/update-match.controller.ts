import { Controller, Put, Param, Body } from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiParam,
} from '@nestjs/swagger';
import {
  UpdateMatchDto,
  UpdateMatchResponseDto,
  ErrorResponseDto,
} from '../../application/dto';
import { UpdateMatchUseCase } from '../../application';

@ApiTags('Matches')
@Controller('matches')
export class UpdateMatchController {
  constructor(private readonly updateMatchUseCase: UpdateMatchUseCase) {}

  @Put(':id')
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Update a match',
    description:
      'Update an existing match with new information. Only the provided fields will be updated, keeping existing values for fields not included in the request. All fields are optional for partial updates.',
    operationId: 'Update Match',
  })
  @ApiParam({
    name: 'id',
    description: 'Unique identifier of the match to update (UUID format)',
    example: '123e4567-e89b-12d3-a456-426614174000',
    type: 'string',
  })
  @ApiResponse({
    status: 200,
    description: 'Match updated successfully',
    type: UpdateMatchResponseDto,
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - Invalid or missing authentication token',
    type: ErrorResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Match not found - The specified match ID does not exist',
    type: ErrorResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Bad Request - Invalid request data or match ID format',
    type: ErrorResponseDto,
  })
  @ApiResponse({
    status: 422,
    description: 'Unprocessable Entity - Validation error in request data',
    type: ErrorResponseDto,
  })
  async update(
    @Param('id') id: string,
    @Body() updateMatchDto: UpdateMatchDto,
  ): Promise<UpdateMatchResponseDto> {
    await this.updateMatchUseCase.execute(id, updateMatchDto);
    return { message: 'Match updated successfully' };
  }
}
