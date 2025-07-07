import { Controller, Get, Query } from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';

import { FindAllMatchesUseCase } from '../../application';
import {
  FindMatchesQueryDto,
  MatchResponseDto,
  ErrorResponseDto,
} from '../../application/dto';

@ApiTags('Matches')
@Controller('matches')
export class FindAllMatchesController {
  constructor(private readonly findAllMatchesUseCase: FindAllMatchesUseCase) {}

  @Get()
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Get all matches',
    description:
      'Retrieve a list of all matches with optional filtering by status, league, date range, and timezone. Supports pagination and various query parameters for flexible match searching.',
  })
  @ApiResponse({
    status: 200,
    description: 'List of matches retrieved successfully',
    type: [MatchResponseDto],
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - Invalid or missing authentication token',
    type: ErrorResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Bad Request - Invalid query parameters',
    type: ErrorResponseDto,
  })
  async findAll(
    @Query() query: FindMatchesQueryDto,
  ): Promise<MatchResponseDto[]> {
    return this.findAllMatchesUseCase.execute(query);
  }
}
