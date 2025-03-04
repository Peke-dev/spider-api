import { Inject, Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

import { FindAccountByIdService } from '@modules/accounts/services';

import { JwtPayload } from '../interfaces';
import { AUTH_MODULE_OPTIONS } from '../constants';
import { AuthModuleOptions } from '../interfaces';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(
    private readonly findAccountByIdService: FindAccountByIdService,
    @Inject(AUTH_MODULE_OPTIONS)
    private readonly config: AuthModuleOptions,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: config.secret,
    });

    console.log('config.secret', config.secret);
  }

  async validate(payload: JwtPayload) {
    console.log('eso!');
    const account = await this.findAccountByIdService.run(payload.sub);

    console.log('account', account);

    return account;
  }
}
