import {
  Controller,
  Put,
  Param,
  Body,
  HttpCode,
  HttpStatus,
  UseGuards,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiParam,
} from '@nestjs/swagger';
import {
  UpdateLeagueDto,
  UpdateLeagueResponseDto,
  ErrorResponseDto,
} from '../../application/dto';
import { UpdateLeagueUseCase } from '../../application';
import { RequiredScopes } from '@modules/auth/infrastructure/decorators';
import { ScopesAuthGuard } from '@modules/auth/infrastructure/security/guards';
import { Scopes } from '@modules/auth/domain/enums';

@ApiTags('Leagues')
@Controller('leagues')
@UseGuards(ScopesAuthGuard)
@ApiBearerAuth()
export class UpdateLeagueController {
  constructor(private readonly updateLeagueUseCase: UpdateLeagueUseCase) {}

  @Put(':id')
  @HttpCode(HttpStatus.OK)
  @RequiredScopes(Scopes.LEAGUES_UPDATE)
  @ApiOperation({
    summary: 'Update a league',
    description:
      'Update an existing league with new information. Only the provided fields will be updated, keeping existing values for fields not included in the request. All fields are optional for partial updates.',
    operationId: 'Update League',
  })
  @ApiParam({
    name: 'id',
    description: 'Unique identifier of the league to update (UUID format)',
    example: '123e4567-e89b-12d3-a456-426614174000',
    type: 'string',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'The league has been successfully updated.',
    type: UpdateLeagueResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Invalid input data - Validation error in request body',
    type: ErrorResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'League not found - The specified league ID does not exist',
    type: ErrorResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    description:
      'Insufficient scopes - User does not have LEAGUES_UPDATE permission',
    type: ErrorResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Unauthorized - Invalid or missing authentication token',
    type: ErrorResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.UNPROCESSABLE_ENTITY,
    description: 'Unprocessable Entity - Validation error in request data',
    type: ErrorResponseDto,
  })
  async update(
    @Param('id') id: string,
    @Body() updateLeagueDto: UpdateLeagueDto,
  ): Promise<UpdateLeagueResponseDto> {
    await this.updateLeagueUseCase.execute(id, updateLeagueDto);
    return { message: 'League updated successfully' };
  }
}
