import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  UseGuards,
} from '@nestjs/common';
import { HttpCode, HttpStatus } from '@nestjs/common';
import {
  CreateLeagueUseCase,
  FindAllLeaguesUseCase,
  FindLeagueByIdUseCase,
  UpdateLeagueUseCase,
} from '../../application';
import { CreateLeagueDto, UpdateLeagueDto } from '../../application/dto';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { RequiredScopes } from '@modules/auth/infrastructure/decorators';
import { ScopesAuthGuard } from '@modules/auth/infrastructure/security/guards';
import { Scopes } from '@modules/auth/domain/enums';

@ApiTags('leagues')
@Controller('leagues')
@UseGuards(ScopesAuthGuard)
@ApiBearerAuth()
export class LeaguesController {
  constructor(
    private readonly createLeagueUseCase: CreateLeagueUseCase,
    private readonly findAllLeaguesUseCase: FindAllLeaguesUseCase,
    private readonly findLeagueByIdUseCase: FindLeagueByIdUseCase,
    private readonly updateLeagueUseCase: UpdateLeagueUseCase,
  ) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @RequiredScopes(Scopes.LEAGUES_CREATE)
  @ApiOperation({
    summary: 'Create a new league',
    operationId: 'Create League',
  })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'The league has been successfully created.',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Invalid input data.',
  })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    description: 'Insufficient scopes.',
  })
  async create(@Body() createLeagueDto: CreateLeagueDto) {
    const id = await this.createLeagueUseCase.execute(createLeagueDto);
    return { id };
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  @RequiredScopes(Scopes.LEAGUES_LIST)
  @ApiOperation({
    summary: 'Get all leagues',
    operationId: 'Find All Leagues',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Return all leagues.',
  })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    description: 'Insufficient scopes.',
  })
  async findAll() {
    return this.findAllLeaguesUseCase.execute({ status: 'enabled' });
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @RequiredScopes(Scopes.LEAGUES_READ)
  @ApiOperation({
    summary: 'Get a league by id',
    operationId: 'Find League By Id',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Return a league by id.',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'League not found.',
  })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    description: 'Insufficient scopes.',
  })
  async findOne(@Param('id') id: string) {
    return this.findLeagueByIdUseCase.execute(id);
  }

  @Put(':id')
  @HttpCode(HttpStatus.OK)
  @RequiredScopes(Scopes.LEAGUES_UPDATE)
  @ApiOperation({ summary: 'Update a league' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'The league has been successfully updated.',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Invalid input data.',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'League not found.',
  })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    description: 'Insufficient scopes.',
  })
  async update(
    @Param('id') id: string,
    @Body() updateLeagueDto: UpdateLeagueDto,
  ) {
    await this.updateLeagueUseCase.execute(id, updateLeagueDto);
    return { message: 'League updated successfully' };
  }
}
