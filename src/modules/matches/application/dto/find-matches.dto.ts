import { MatchShortStatusEnum, MatchTypeEnum } from '@modules/matches/domain';
import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsUUID } from 'class-validator';

export class FindMatchesQueryDto {
  @IsEnum(MatchTypeEnum)
  @IsOptional()
  @ApiProperty({ example: MatchTypeEnum.FINISHED, required: false })
  statusType?: MatchTypeEnum;

  @IsEnum(MatchShortStatusEnum)
  @IsOptional()
  @ApiProperty({ example: MatchShortStatusEnum.FT, required: false })
  status?: MatchShortStatusEnum;

  @IsUUID()
  @IsOptional()
  @ApiProperty({
    example: '123e4567-e89b-12d3-a456-426614174000',
    required: false,
  })
  league?: string;
}
