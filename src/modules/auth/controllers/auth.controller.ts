import { Body, Controller, Post } from '@nestjs/common';
import { LoginService } from '../services/login.service';
import { LoginDto } from '../dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly loginService: LoginService) {}

  @Post('login')
  login(@Body() loginDto: LoginDto) {
    return this.loginService.run(loginDto);
  }
}
