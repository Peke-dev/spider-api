import { IsEmail, IsString, MinLength } from 'class-validator';

export class RegisterDto {
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(6)
  password: string;

  constructor(partial: Partial<RegisterDto>) {
    Object.assign(this, partial);
  }
}
