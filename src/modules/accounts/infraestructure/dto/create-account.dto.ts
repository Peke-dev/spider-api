import { IsNotEmpty, IsString, IsEmail } from 'class-validator';

export class CreateAccountDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  password: string;

  constructor(partial: Partial<CreateAccountDto>) {
    Object.assign(this, partial);
  }
}
