import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { Match } from '../../domain/entities';
import { FindAllMatchesUseCase } from '../../application';

@ApiTags('matches')
@Controller('matches')
export class FindAllMatchesController {
  constructor(private readonly findAllMatchesUseCase: FindAllMatchesUseCase) {}

  @Get()
  @ApiOperation({ summary: 'Get all matches' })
  @ApiResponse({ status: 200, description: 'Return all matches' })
  async findAll(): Promise<Match[]> {
    return this.findAllMatchesUseCase.execute();
  }
}
