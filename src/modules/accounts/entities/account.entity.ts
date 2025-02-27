import { IsNotEmpty, IsString, IsEmail, IsDate } from 'class-validator';
import { Exclude } from 'class-transformer';

export class Account {
  @IsString()
  @IsNotEmpty()
  user: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  @Exclude() // Hide password from responses
  password: string;

  @IsString()
  @Exclude() // Hide token from responses
  token: string;

  @IsDate()
  @IsNotEmpty()
  createdAt: Date;

  @IsDate()
  @IsNotEmpty()
  updatedAt: Date;
}
