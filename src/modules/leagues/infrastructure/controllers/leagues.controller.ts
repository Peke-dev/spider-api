import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { HttpCode, HttpStatus, UseGuards } from '@nestjs/common';
import {
  CreateLeagueUseCase,
  FindAllLeaguesUseCase,
  FindLeagueByIdUseCase,
} from '../../application';
import { CreateLeagueDto } from '../../application/dto';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { JwtAuthGuard } from '@modules/auth';

@UseGuards(JwtAuthGuard)
@ApiTags('Leagues')
@Controller('leagues')
export class LeaguesController {
  constructor(
    private readonly createLeagueUseCase: CreateLeagueUseCase,
    private readonly findAllLeaguesUseCase: FindAllLeaguesUseCase,
    private readonly findLeagueByIdUseCase: FindLeagueByIdUseCase,
  ) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a new league' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'The league has been successfully created.',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Invalid input data.',
  })
  async create(@Body() createLeagueDto: CreateLeagueDto) {
    const id = await this.createLeagueUseCase.execute(createLeagueDto);
    return { id };
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get all leagues' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Return all leagues.',
  })
  async findAll() {
    return this.findAllLeaguesUseCase.execute();
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get a league by id' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Return a league by id.',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'League not found.',
  })
  async findOne(@Param('id') id: string) {
    return this.findLeagueByIdUseCase.execute(id);
  }
}
