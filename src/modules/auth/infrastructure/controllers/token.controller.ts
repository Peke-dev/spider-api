import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  HttpCode,
  HttpStatus,
  UseGuards,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBearerAuth,
} from '@nestjs/swagger';
import {
  GetTokenByIdUseCase,
  CreateTokenUseCase,
  GetAllTokensUseCase,
} from '../../application/use-cases';
import { CreateTokenDto } from '../../application/dtos';
import { Token } from '../../domain/entities';
import { ScopesAuthGuard } from '../security/guards';
import { RequiredScopes } from '../decorators';
import { Scopes } from '../../domain/enums';

@ApiTags('Tokens')
@Controller('tokens')
@UseGuards(ScopesAuthGuard)
@ApiBearerAuth()
export class TokenController {
  constructor(
    private readonly getTokenByIdUseCase: GetTokenByIdUseCase,
    private readonly createTokenUseCase: CreateTokenUseCase,
    private readonly getAllTokensUseCase: GetAllTokensUseCase,
  ) {}

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @RequiredScopes(Scopes.TOKENS_ALL)
  @ApiOperation({ summary: 'Get token by ID' })
  @ApiParam({ name: 'id', description: 'Token ID' })
  @ApiResponse({
    status: 200,
    description: 'Token found successfully',
    type: Token,
  })
  @ApiResponse({
    status: 404,
    description: 'Token not found',
  })
  @ApiResponse({
    status: 403,
    description: 'Insufficient scopes',
  })
  async getTokenById(@Param('id') id: string): Promise<Token> {
    return this.getTokenByIdUseCase.execute(id);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @RequiredScopes(Scopes.TOKENS_ALL)
  @ApiOperation({ summary: 'Create a new token' })
  @ApiResponse({
    status: 201,
    description: 'Token created successfully',
    type: Token,
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request - invalid data',
  })
  @ApiResponse({
    status: 403,
    description: 'Insufficient scopes',
  })
  async createToken(@Body() createTokenDto: CreateTokenDto): Promise<Token> {
    return this.createTokenUseCase.execute(createTokenDto);
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  @RequiredScopes(Scopes.TOKENS_ALL)
  @ApiOperation({ summary: 'Get all tokens' })
  @ApiResponse({
    status: 200,
    description: 'Tokens retrieved successfully',
    type: [Token],
  })
  @ApiResponse({
    status: 403,
    description: 'Insufficient scopes',
  })
  async getAllTokens(): Promise<Token[]> {
    return this.getAllTokensUseCase.execute();
  }
}
