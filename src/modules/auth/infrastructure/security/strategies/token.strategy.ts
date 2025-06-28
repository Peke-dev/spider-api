import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-http-bearer';
import { Token } from '../../../domain/entities';

@Injectable()
export class TokenStrategy extends PassportStrategy(Strategy, 'token') {
  constructor(
    @Inject('TOKEN_LIST')
    private readonly tokens: Token[],
  ) {
    super();
  }

  validate(token: string): any {
    const validTokens = this.tokens.map((t) => t.id);

    if (!validTokens.length) {
      throw new UnauthorizedException('No valid tokens configured');
    }

    if (!validTokens.includes(token)) {
      throw new UnauthorizedException('Invalid token');
    }

    // Find and return the token object
    const tokenObject = this.tokens.find((t) => t.id === token);
    if (!tokenObject) {
      throw new UnauthorizedException('Token not found');
    }

    return { token: tokenObject };
  }
}
