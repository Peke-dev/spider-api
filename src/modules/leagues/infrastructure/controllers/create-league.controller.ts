import {
  Controller,
  Post,
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
} from '@nestjs/swagger';
import {
  CreateLeagueDto,
  CreateLeagueResponseDto,
  ErrorResponseDto,
} from '../../application/dto';
import { CreateLeagueUseCase } from '../../application';
import { RequiredScopes } from '@modules/auth/infrastructure/decorators';
import { ScopesAuthGuard } from '@modules/auth/infrastructure/security/guards';
import { Scopes } from '@modules/auth/domain/enums';

@ApiTags('Leagues')
@Controller('leagues')
@UseGuards(ScopesAuthGuard)
@ApiBearerAuth()
export class CreateLeagueController {
  constructor(private readonly createLeagueUseCase: CreateLeagueUseCase) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @RequiredScopes(Scopes.LEAGUES_CREATE)
  @ApiOperation({
    summary: 'Create a new league',
    description:
      'Create a new league with complete information including country, seasons, and league type. The league will be created with DISABLED status by default and can be enabled later.',
    operationId: 'Create League',
  })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'The league has been successfully created.',
    type: CreateLeagueResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Invalid input data - Validation error in request body',
    type: ErrorResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    description:
      'Insufficient scopes - User does not have LEAGUES_CREATE permission',
    type: ErrorResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Unauthorized - Invalid or missing authentication token',
    type: ErrorResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.CONFLICT,
    description: 'Conflict - League with the same ID already exists',
    type: ErrorResponseDto,
  })
  async create(
    @Body() createLeagueDto: CreateLeagueDto,
  ): Promise<CreateLeagueResponseDto> {
    const id = await this.createLeagueUseCase.execute(createLeagueDto);
    return { id };
  }
}
