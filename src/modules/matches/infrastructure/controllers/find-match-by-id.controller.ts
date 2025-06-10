import { Controller, Get, Param, NotFoundException } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { Match } from '../../domain/entities';
import { FindMatchByIdUseCase } from '../../application';

@ApiTags('matches')
@Controller('matches')
export class FindMatchByIdController {
  constructor(private readonly findMatchByIdUseCase: FindMatchByIdUseCase) {}

  @Get(':id')
  @ApiOperation({ summary: 'Get a match by id' })
  @ApiResponse({ status: 200, description: 'Return a match by id' })
  @ApiResponse({ status: 404, description: 'Match not found' })
  async findOne(@Param('id') id: string): Promise<Match> {
    const match = await this.findMatchByIdUseCase.execute(id);

    if (!match) {
      throw new NotFoundException(`Match with ID ${id} not found`);
    }

    return match;
  }
}
