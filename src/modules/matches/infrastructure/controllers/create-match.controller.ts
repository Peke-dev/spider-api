import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { CreateMatchDto } from '../dto';
import { CreateMatchUseCase } from '../../application';
import { JwtAuthGuard } from '@modules/auth';

@UseGuards(JwtAuthGuard)
@ApiTags('matches')
@Controller('matches')
export class CreateMatchController {
  constructor(private readonly createMatchUseCase: CreateMatchUseCase) {}

  @Post()
  @ApiOperation({ summary: 'Create a new match' })
  @ApiResponse({ status: 201, description: 'Match created successfully' })
  async create(@Body() createMatchDto: CreateMatchDto) {
    const id = await this.createMatchUseCase.execute(createMatchDto);
    return { id };
  }
}
