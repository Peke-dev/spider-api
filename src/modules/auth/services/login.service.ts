import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { FindAccountByService } from '@modules/accounts/services';

import { LoginDto } from '../dto';

@Injectable()
export class LoginService {
  constructor(
    private readonly findAccountService: FindAccountByService,
    private readonly jwtService: JwtService,
  ) {}

  async run(loginDto: LoginDto) {
    const account = await this.findAccountService.run('email', loginDto.email);

    if (!account) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordValid = await bcrypt.compare(
      loginDto.password,
      account.password,
    );

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload = { sub: account.id, email: account.email };
    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }
}
