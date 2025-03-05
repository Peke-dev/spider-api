import { Inject, Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

import { FindAccountByIdUseCase } from '@modules/accounts/';

import { JwtPayload } from '../interfaces';
import { AUTH_MODULE_OPTIONS } from '../constants';
import { AuthModuleOptions } from '../interfaces';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(
    private readonly findAccountByIdService: FindAccountByIdUseCase,
    @Inject(AUTH_MODULE_OPTIONS)
    private readonly config: AuthModuleOptions,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: config.secret,
    });
  }

  async validate(payload: JwtPayload) {
    return await this.findAccountByIdService.execute(payload.sub);
  }
}
