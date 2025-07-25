import { Transform } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import {
  IsEnum,
  IsOptional,
  IsUUID,
  Matches,
  ValidateIf,
} from 'class-validator';

import { IsLaterThan } from '@common/decorators';

import { DATE_FORMAT_REGEX } from '../../constants';
import {
  DateStringEnum,
  MatchShortStatusEnum,
  MatchTypeEnum,
  TimezoneEnum,
} from '../../domain';

export class FindMatchesQueryDto {
  @IsEnum(MatchTypeEnum, { each: true })
  @IsOptional()
  @ApiProperty({
    example: [MatchTypeEnum.FINISHED, MatchTypeEnum.IN_PLAY],
    required: false,
    isArray: true,
  })
  @Transform(({ value }) => value.split(',').map((v) => v.trim().toUpperCase()))
  statusType?: MatchTypeEnum | MatchTypeEnum[];

  @IsEnum(MatchShortStatusEnum)
  @IsOptional()
  @ApiProperty({ example: MatchShortStatusEnum.FT, required: false })
  @Transform(({ value }) => value.toUpperCase().trim())
  status?: MatchShortStatusEnum;

  @IsUUID()
  @IsOptional()
  @ApiProperty({
    example: '123e4567-e89b-12d3-a456-426614174000',
    required: false,
  })
  league?: string;

  @IsEnum(DateStringEnum)
  @IsOptional()
  @ApiProperty({ example: DateStringEnum.TODAY, required: false })
  @Transform(({ value }) => value.toUpperCase().trim())
  dateString?: DateStringEnum;

  @Matches(DATE_FORMAT_REGEX, {
    message: 'from must be in YYYY-MM-DD format',
  })
  @IsOptional()
  @ApiProperty({ example: '2025-01-01', required: false })
  from?: string;

  @Matches(DATE_FORMAT_REGEX, {
    message: 'to must be in YYYY-MM-DD format',
  })
  @IsLaterThan('from')
  @IsOptional()
  @ValidateIf((o) => o.from)
  @ApiProperty({ example: '2025-01-01', required: false })
  to?: string;

  @IsEnum(TimezoneEnum)
  @IsOptional()
  @ApiProperty({ example: TimezoneEnum.UTC, required: false })
  timezone?: TimezoneEnum;

  @ApiProperty({
    example: 1,
    required: false,
    description: 'Page number for pagination (default: 1)',
  })
  @Transform(({ value }) => (value ? parseInt(value, 10) : 1))
  @IsOptional()
  page?: number;
}
