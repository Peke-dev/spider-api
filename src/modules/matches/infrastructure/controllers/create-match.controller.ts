import { Controller, Post, Body, NotFoundException } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { CreateMatchDto } from '../../application/dto';
import { CreateMatchUseCase, UpdateMatchUseCase } from '../../application';
import { LeagueRepository } from '@modules/leagues/domain/repositories';

@ApiTags('matches')
@Controller('matches')
export class CreateMatchController {
  constructor(
    private readonly createMatchUseCase: CreateMatchUseCase,
    private readonly updateMatchUseCase: UpdateMatchUseCase,
    private readonly leagueRepository: LeagueRepository,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Create a match' })
  @ApiResponse({ status: 201, description: 'Match created successfully' })
  @ApiResponse({ status: 404, description: 'League not found' })
  async create(@Body() createMatchDto: CreateMatchDto) {
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
