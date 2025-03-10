import { Body, Controller, Post } from '@nestjs/common';
import { LoginDto, LoginUseCase } from '../../application';

@Controller('auth')
export class AuthController {
  constructor(private readonly loginUseCase: LoginUseCase) {}

  @Post('login')
  login(@Body() loginDto: LoginDto) {
    return this.loginUseCase.execute(loginDto);
  }
}
