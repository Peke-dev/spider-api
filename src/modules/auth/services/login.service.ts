import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

import { Account, ACCOUNTS_COLLECTION } from '@modules/accounts';

import { LoginDto } from '../dto';
import { RepositoryInterface } from '@modules/database';

@Injectable()
export class LoginService {
  constructor(
    @Inject(ACCOUNTS_COLLECTION)
    private readonly repository: RepositoryInterface<Account>,
    private readonly jwtService: JwtService,
  ) {}

  async run(loginDto: LoginDto) {
    const account = await this.repository.findOneBy('email', loginDto.email);

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
