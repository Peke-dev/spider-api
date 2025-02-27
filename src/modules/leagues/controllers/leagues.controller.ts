import { Controller, Get, Param, NotFoundException } from '@nestjs/common';

import { FindAllLeaguesService, FindLeagueByIdService } from '../services/';
import { League } from '../entities';

@Controller('leagues')
export class LeagueController {
  constructor(
    private readonly findLeagueByIdService: FindLeagueByIdService,
    private readonly findAllLeaguesService: FindAllLeaguesService,
  ) {}

  @Get()
  findAll(): Promise<League[]> {
    return this.findAllLeaguesService.run();
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<League> {
    const league = await this.findLeagueByIdService.run(id);

    if (!league) {
      throw new NotFoundException(`Match with ID ${id} not found`);
    }

    return league;
  }
}
