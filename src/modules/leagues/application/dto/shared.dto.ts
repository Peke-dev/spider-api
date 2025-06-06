import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsNumber,
  IsBoolean,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class SeasonDto {
  @IsNumber({}, { message: 'Year must be a number' })
  @IsNotEmpty({ message: 'Year is required' })
  @ApiProperty({ example: 2023 })
  year: number;

  @IsString({ message: 'Start date must be a string' })
  @IsNotEmpty({ message: 'Start date is required' })
  @ApiProperty({ example: '2023-08-11' })
  start: string;

  @IsString({ message: 'End date must be a string' })
  @IsNotEmpty({ message: 'End date is required' })
  @ApiProperty({ example: '2024-05-19' })
  end: string;

  @IsBoolean({ message: 'Current must be a boolean' })
  @IsNotEmpty({ message: 'Current is required' })
  @ApiProperty({ example: true })
  current: boolean;
}

export class CreateCountryDto {
  @IsString({ message: 'Name must be a string' })
  @IsNotEmpty({ message: 'Name is required' })
  @ApiProperty({ example: 'England' })
  name: string;

  @IsString({ message: 'Code must be a string' })
  @IsNotEmpty({ message: 'Code is required' })
  @ApiProperty({ example: 'ENG' })
  @IsOptional()
  code: string | null = null;

  @IsString({ message: 'Flag must be a string' })
  @IsNotEmpty({ message: 'Flag is required' })
  @ApiProperty({ example: 'https://media.api-sports.io/flags/eng.svg' })
  @IsOptional()
  flag: string | null = null;
}
