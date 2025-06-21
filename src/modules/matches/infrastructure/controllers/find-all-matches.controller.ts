import { Controller, Get, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { Match } from '../../domain';
import { FindAllMatchesUseCase } from '../../application';
import { FindMatchesQueryDto } from '../../application/dto';

@ApiTags('matches')
@Controller('matches')
export class FindAllMatchesController {
  constructor(private readonly findAllMatchesUseCase: FindAllMatchesUseCase) {}

  @Get()
  @ApiOperation({ summary: 'Get all matches' })
  @ApiResponse({ status: 200, description: 'Return all matches' })
  async findAll(@Query() query: FindMatchesQueryDto): Promise<Match[]> {
    return this.findAllMatchesUseCase.execute(query);
  }
}
