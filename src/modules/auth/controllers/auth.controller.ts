import { Body, Controller, Post } from '@nestjs/common';
import { LoginService } from '../services/login.service';
import { RegisterService } from '../services/register.service';
import { LoginDto, RegisterDto } from '../dto';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly loginService: LoginService,
    private readonly registerService: RegisterService,
  ) {}

  @Post('login')
  login(@Body() loginDto: LoginDto) {
    return this.loginService.run(loginDto);
  }

  @Post('register')
  register(@Body() registerDto: RegisterDto) {
    return this.registerService.run(registerDto);
  }
}
