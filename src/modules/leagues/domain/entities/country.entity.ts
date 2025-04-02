import { IsString, IsOptional, IsNotEmpty } from 'class-validator';

export class Country {
  @IsString()
  @IsOptional()
  code: string | null;

  @IsString()
  @IsOptional()
  flag: string | null;

  @IsString()
  @IsNotEmpty()
  name: string;

  constructor(partial: Partial<Country>) {
    Object.assign(this, partial);
  }
}
