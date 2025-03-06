import { Controller, Get, Post, Body, Param, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { CreateMatchDto } from '../dto';
import { Match } from '../../domain/entities';
import {
  CreateMatchUseCase,
  FindMatchByIdUseCase,
  FindAllMatchesUseCase,
} from '../../application';
import { JwtAuthGuard } from '@modules/auth';

@UseGuards(JwtAuthGuard)
@ApiTags('matches')
@Controller('matches')
export class MatchesController {
  constructor(
    private readonly createMatchUseCase: CreateMatchUseCase,
    private readonly findMatchByIdUseCase: FindMatchByIdUseCase,
    private readonly findAllMatchesUseCase: FindAllMatchesUseCase,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Create a new match' })
  @ApiResponse({ status: 201, description: 'Match created successfully' })
  async create(@Body() createMatchDto: CreateMatchDto) {
    const id = await this.createMatchUseCase.execute(createMatchDto);
    return { id };
  }

  @Get()
  @ApiOperation({ summary: 'Get all matches' })
  @ApiResponse({ status: 200, description: 'Return all matches' })
  async findAll(): Promise<Match[]> {
    return this.findAllMatchesUseCase.execute();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a match by id' })
  @ApiResponse({ status: 200, description: 'Return a match by id' })
  @ApiResponse({ status: 404, description: 'Match not found' })
  async findOne(@Param('id') id: string): Promise<Match> {
    return this.findMatchByIdUseCase.execute(id);
  }
}
