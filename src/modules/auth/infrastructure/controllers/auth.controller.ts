import { Body, Controller, Post } from '@nestjs/common';
import { LoginUseCase } from '../../application/use-cases';
import { LoginDto } from '../../application/dtos';

@Controller('auth')
export class AuthController {
  constructor(private readonly loginUseCase: LoginUseCase) {}

  @Post('login')
  login(@Body() loginDto: LoginDto) {
    return this.loginUseCase.execute(loginDto);
  }
}
