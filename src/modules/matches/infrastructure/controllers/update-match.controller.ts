import { Controller, Put, Param, Body } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { UpdateMatchDto } from '../../application/dto';
import { UpdateMatchUseCase } from '../../application';

@ApiTags('matches')
@Controller('matches')
export class UpdateMatchController {
  constructor(private readonly updateMatchUseCase: UpdateMatchUseCase) {}

  @Put(':id')
  @ApiOperation({ summary: 'Update a match' })
  @ApiResponse({ status: 200, description: 'Match updated successfully' })
  async update(
    @Param('id') id: string,
    @Body() updateMatchDto: UpdateMatchDto,
  ) {
    await this.updateMatchUseCase.execute(id, updateMatchDto);
    return { message: 'Match updated successfully' };
  }
}
