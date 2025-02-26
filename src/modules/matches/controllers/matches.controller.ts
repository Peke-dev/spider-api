import { Controller, Get, Param, NotFoundException } from '@nestjs/common';
import { FindAllMatchesService, FindMatchByIdService } from '../services/';
import { Match } from '../interfaces/match.interface';

@Controller('matches')
export class MatchesController {
  constructor(
    private readonly findMatchByIdService: FindMatchByIdService,
    private readonly findAllMatchesService: FindAllMatchesService,
  ) {}

  @Get()
  findAll(): Promise<Match[]> {
    return this.findAllMatchesService.run();
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Match> {
    const match = await this.findMatchByIdService.run(id);

    if (!match) {
      throw new NotFoundException(`Match with ID ${id} not found`);
    }

    return match;
  }
}
