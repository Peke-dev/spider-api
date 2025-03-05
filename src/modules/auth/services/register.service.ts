import { Injectable } from '@nestjs/common';
import { CreateAccountUseCase } from '../../accounts';
import { RegisterDto } from '../dto';

@Injectable()
export class RegisterService {
  constructor(private readonly createAccountUseCase: CreateAccountUseCase) {}

  async run(registerDto: RegisterDto) {
    const accountId = await this.createAccountUseCase.execute(registerDto);
    return { id: accountId };
  }
}
