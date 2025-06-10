import { Controller, Post, Body } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { CreateMatchDto } from '../../application/dto';
import { CreateMatchUseCase } from '../../application';

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
