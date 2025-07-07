import { Controller, Get, Param, NotFoundException } from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiParam,
} from '@nestjs/swagger';
import { FindMatchByIdUseCase } from '../../application';
import { MatchResponseDto, ErrorResponseDto } from '../../application/dto';

@ApiTags('Matches')
@Controller('matches')
export class FindMatchByIdController {
  constructor(private readonly findMatchByIdUseCase: FindMatchByIdUseCase) {}

  @Get(':id')
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Get a match by ID',
    description:
      'Retrieve detailed information about a specific match using its unique identifier. Returns complete match data including teams, scores, venue, and status information.',
  })
  @ApiParam({
    name: 'id',
    description: 'Unique identifier of the match (UUID format)',
    example: '123e4567-e89b-12d3-a456-426614174000',
    type: 'string',
  })
  @ApiResponse({
    status: 200,
    description: 'Match found and returned successfully',
    type: MatchResponseDto,
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
    description: 'Bad Request - Invalid match ID format',
    type: ErrorResponseDto,
  })
  async findOne(@Param('id') id: string): Promise<MatchResponseDto> {
    const match = await this.findMatchByIdUseCase.execute(id);

    if (!match) {
      throw new NotFoundException(`Match with ID ${id} not found`);
    }

    return match;
  }
}
