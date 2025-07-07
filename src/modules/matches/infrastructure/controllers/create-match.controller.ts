import { Controller, Post, Body, NotFoundException } from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import {
  CreateMatchDto,
  CreateMatchResponseDto,
  ErrorResponseDto,
} from '../../application/dto';
import { CreateMatchUseCase } from '../../application';
import { LeagueRepository } from '@modules/leagues/domain/repositories';

@ApiTags('Matches')
@Controller('matches')
export class CreateMatchController {
  constructor(
    private readonly createMatchUseCase: CreateMatchUseCase,
    private readonly leagueRepository: LeagueRepository,
  ) {}

  @Post()
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Create a new match',
    description:
      'Create a new match with complete match information including teams, scores, venue, league details, and match status. The league must exist in the system before creating a match.',
  })
  @ApiResponse({
    status: 201,
    description: 'Match created successfully',
    type: CreateMatchResponseDto,
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - Invalid or missing authentication token',
    type: ErrorResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'League not found - The specified league ID does not exist',
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
  @ApiResponse({
    status: 409,
    description: 'Conflict - Match with the same ID already exists',
    type: ErrorResponseDto,
  })
  async create(
    @Body() createMatchDto: CreateMatchDto,
  ): Promise<CreateMatchResponseDto> {
    const league = await this.leagueRepository.findOneById(
      createMatchDto.league.id.toString(),
    );

    if (!league) {
      throw new NotFoundException(
        `League with ID ${createMatchDto.league.id} not found`,
      );
    }

    const id = await this.createMatchUseCase.execute(createMatchDto);
    return { id, message: 'Match created successfully' };
  }
}
