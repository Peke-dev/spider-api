import { IsNotEmpty, IsString, IsEmail } from 'class-validator';

export class CreateAccountDto {
  @IsString()
  @IsNotEmpty()
  user: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  password: string;
}
