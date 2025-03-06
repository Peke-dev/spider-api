import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

import { LoginDto } from '../dtos/login.dto';
import { AccountRepository } from '@modules/auth/infrastructure/persistence/account.repository';

@Injectable()
export class LoginUseCase {
  constructor(
    private readonly accountRepository: AccountRepository,
    private readonly jwtService: JwtService,
  ) {}

  async execute(loginDto: LoginDto) {
    const account = await this.accountRepository.findByEmail(loginDto.email);

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
