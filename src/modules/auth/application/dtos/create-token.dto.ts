import { IsString, IsArray, IsEnum } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Scopes } from '../../domain/enums';

export class CreateTokenDto {
  @ApiProperty({
    description: 'Name of the account associated with the token',
    example: 'user123',
  })
  @IsString()
  accountName: string;

  @ApiProperty({
    description: 'List of scopes for the token',
    example: [Scopes.LEAGUES_LIST],
    enum: Scopes,
    isArray: true,
  })
  @IsArray()
  @IsEnum(Scopes, { each: true })
  scopes: Scopes[];
}
