import { Controller, Post, UseGuards } from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { ScopesAuthGuard } from '../security/guards';
import { RequiredScopes } from '../decorators';
import { Scopes } from '../../domain/enums';

@ApiTags('Auth')
@Controller('auth')
@UseGuards(ScopesAuthGuard)
@ApiBearerAuth()
export class AuthController {
  constructor() {}

  @Post('validate')
  @RequiredScopes(Scopes.TOKENS_ALL)
  @ApiOperation({
    summary: 'Validate token',
    description:
      'Validates if the provided token is valid and has the required scopes',
  })
  @ApiResponse({
    status: 200,
    description: 'Token is valid',
  })
  @ApiResponse({
    status: 401,
    description: 'Token is invalid or missing',
  })
  @ApiResponse({
    status: 403,
    description: 'Insufficient scopes',
  })
  validateToken() {
    return {
      message: 'Token is valid',
      timestamp: new Date().toISOString(),
    };
  }
}
