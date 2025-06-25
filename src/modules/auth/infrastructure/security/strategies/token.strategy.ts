import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-http-bearer';
import { GlobalConfigType, configuration } from '@config';

@Injectable()
export class TokenStrategy extends PassportStrategy(Strategy, 'token') {
  constructor(
    @Inject(configuration.KEY)
    private readonly configService: GlobalConfigType,
  ) {
    super();
  }

  validate(token: string): boolean {
    const authTokens = this.configService.AUTH_TOKENS;

    if (!authTokens || authTokens.trim() === '') {
      throw new UnauthorizedException('AUTH_TOKENS not configured');
    }

    const validTokens = authTokens
      .split(/[,;]/)
      .map((t) => t.trim())
      .filter((t) => t.length > 0);

    if (validTokens.length === 0) {
      throw new UnauthorizedException('No valid tokens configured');
    }

    if (!validTokens.includes(token)) {
      throw new UnauthorizedException('Invalid token');
    }

    return true;
  }
}
