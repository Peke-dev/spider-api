import { IsBoolean, IsNumber, IsString } from 'class-validator';

export class Season {
  @IsBoolean()
  current: boolean;

  @IsNumber()
  year: number;

  @IsString()
  start: string;

  @IsString()
  end: string;

  constructor(partial: Partial<Season>) {
    Object.assign(this, partial);
  }
}
