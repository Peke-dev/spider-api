import { IsNotEmpty, IsString, IsEmail, IsDate } from 'class-validator';
import { Exclude } from 'class-transformer';

export class Account {
  @IsString()
  @IsNotEmpty()
  id: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  @Exclude()
  password: string;

  @IsDate()
  @IsNotEmpty()
  createdAt: Date;

  @IsDate()
  @IsNotEmpty()
  updatedAt: Date;

  constructor(partial: Partial<Account>) {
    Object.assign(this, partial);
  }
}
