import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  UseGuards,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { LeagueResponseDto, ErrorResponseDto } from '../../application/dto';
import { FindAllLeaguesUseCase } from '../../application';
import { RequiredScopes } from '@modules/auth/infrastructure/decorators';
import { ScopesAuthGuard } from '@modules/auth/infrastructure/security/guards';
import { Scopes } from '@modules/auth/domain/enums';

@ApiTags('Leagues')
@Controller('leagues')
@UseGuards(ScopesAuthGuard)
@ApiBearerAuth()
export class FindAllLeaguesController {
  constructor(private readonly findAllLeaguesUseCase: FindAllLeaguesUseCase) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  @RequiredScopes(Scopes.LEAGUES_LIST)
  @ApiOperation({
    summary: 'Get all leagues',
    description:
      'Retrieve a list of all enabled leagues with their complete information including country, seasons, and status. Only leagues with ENABLED status are returned by default.',
    operationId: 'Find All Leagues',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'List of leagues retrieved successfully.',
    type: [LeagueResponseDto],
  })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    description:
      'Insufficient scopes - User does not have LEAGUES_LIST permission',
    type: ErrorResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Unauthorized - Invalid or missing authentication token',
    type: ErrorResponseDto,
  })
  async findAll(): Promise<LeagueResponseDto[]> {
    return this.findAllLeaguesUseCase.execute({ status: 'enabled' });
  }
}
