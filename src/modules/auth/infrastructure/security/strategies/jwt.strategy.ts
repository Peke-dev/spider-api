import { Inject, Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

import { JwtPayload, AuthModuleOptions } from '../../interfaces';
import { AUTH_MODULE_OPTIONS } from '../../../constants';
import { AccountRepository } from '../../persistence/account.repository';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(
    private readonly accountRepository: AccountRepository,
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
    return await this.accountRepository.findByEmail(payload.email);
  }
}
