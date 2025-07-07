import {
  Controller,
  Get,
  Param,
  HttpCode,
  HttpStatus,
  UseGuards,
  Headers,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiParam,
} from '@nestjs/swagger';
import { LeagueResponseDto, ErrorResponseDto } from '../../application/dto';
import { FindLeagueByIdUseCase } from '../../application';
import { RequiredScopes } from '@modules/auth/infrastructure/decorators';
import { ScopesAuthGuard } from '@modules/auth/infrastructure/security/guards';
import { Scopes } from '@modules/auth/domain/enums';

@ApiTags('Leagues')
@Controller('leagues')
@UseGuards(ScopesAuthGuard)
@ApiBearerAuth()
export class FindLeagueByIdController {
  constructor(private readonly findLeagueByIdUseCase: FindLeagueByIdUseCase) {}

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @RequiredScopes(Scopes.LEAGUES_READ)
  @ApiOperation({
    summary: 'Get a league by ID',
    description:
      'Retrieve detailed information about a specific league using its unique identifier. Returns complete league data including country, seasons, and status information.',
    operationId: 'Find League By Id',
  })
  @ApiParam({
    name: 'id',
    description: 'Unique identifier of the league (UUID format)',
    example: '123e4567-e89b-12d3-a456-426614174000',
    type: 'string',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'League found and returned successfully.',
    type: LeagueResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'League not found - The specified league ID does not exist',
    type: ErrorResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    description:
      'Insufficient scopes - User does not have LEAGUES_READ permission',
    type: ErrorResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Unauthorized - Invalid or missing authentication token',
    type: ErrorResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Bad Request - Invalid league ID format',
    type: ErrorResponseDto,
  })
  async findOne(
    @Param('id') id: string,
    @Headers() headers: Headers,
  ): Promise<LeagueResponseDto> {
    console.log(headers);
    return this.findLeagueByIdUseCase.execute(id);
  }
}
