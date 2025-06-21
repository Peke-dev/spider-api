import { MatchShortStatusEnum, MatchTypeEnum } from '@modules/matches/domain';
import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsOptional } from 'class-validator';

export class FindMatchesQueryDto {
  @IsEnum(MatchTypeEnum)
  @IsOptional()
  @ApiProperty({ example: MatchTypeEnum.FINISHED, required: false })
  statusType?: MatchTypeEnum;

  @IsEnum(MatchShortStatusEnum)
  @IsOptional()
  @ApiProperty({ example: MatchShortStatusEnum.FT, required: false })
  status?: MatchShortStatusEnum;
}
