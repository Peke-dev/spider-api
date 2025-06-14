import {
  Controller,
  Post,
  Body,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { CreateMatchDto, UpdateMatchDto } from '../../application/dto';
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
  @ApiOperation({ summary: 'Create or update a match' })
  @ApiResponse({ status: 201, description: 'Match created successfully' })
  @ApiResponse({ status: 200, description: 'Match updated successfully' })
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

    try {
      const id = await this.createMatchUseCase.execute(createMatchDto);
      return { id, message: 'Match created successfully' };
    } catch (error) {
      if (error instanceof ConflictException) {
        const updateDto = createMatchDto as unknown as UpdateMatchDto;
        await this.updateMatchUseCase.execute(createMatchDto.id, updateDto);
        return { id: createMatchDto.id, message: 'Match updated successfully' };
      }
      throw error;
    }
  }
}
