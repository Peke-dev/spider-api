import { Injectable } from '@nestjs/common';
import { CreateAccountService } from '../../accounts/services';
import { RegisterDto } from '../dto';

@Injectable()
export class RegisterService {
  constructor(private readonly createAccountService: CreateAccountService) {}

  async run(registerDto: RegisterDto) {
    const accountId = await this.createAccountService.run(registerDto);
    return { id: accountId };
  }
}
