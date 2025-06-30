import { Injectable } from '@nestjs/common';
import * as dayjs from 'dayjs';
import * as utc from 'dayjs/plugin/utc';
import * as timezone from 'dayjs/plugin/timezone';

import {
  Match,
  MatchRepository,
  DateStringEnum,
  TimezoneEnum,
} from '../../domain';
import { FindMatchesQueryDto } from '../dto';

dayjs.extend(utc);
dayjs.extend(timezone);

@Injectable()
export class FindAllMatchesUseCase {
  constructor(private readonly repository: MatchRepository) {}

  async execute(queryParams: FindMatchesQueryDto = {}): Promise<Match[]> {
    const dateFormat = 'YYYY-MM-DD';

    const {
      statusType,
      status,
      league,
      to,
      dateString,
      timezone = TimezoneEnum.EUROPE_MADRID,
    } = queryParams;
    let { from } = queryParams;

    const query = {};

    if (dateString) {
      const day = dayjs();
      if (dateString === DateStringEnum.TODAY) {
        from = day.tz(timezone).format(dateFormat);
      }

      if (dateString === DateStringEnum.TOMORROW) {
        from = day.add(1, 'day').tz(timezone).format(dateFormat);
      }

      if (dateString === DateStringEnum.YESTERDAY) {
        from = day.subtract(1, 'day').tz(timezone).format(dateFormat);
      }

      if (dateString === DateStringEnum.LAST_WEEK) {
        from = day.subtract(1, 'week').tz(timezone).format(dateFormat);
      }
    }

    if (from) {
      const fromDay = dayjs.tz(from, dateFormat, timezone).startOf('day');

      const toDay = to
        ? dayjs.tz(to, dateFormat, timezone).endOf('day')
        : fromDay.endOf('day');

      query['timestamp'] = {
        $gte: fromDay.unix(),
        $lte: toDay.unix(),
      };
    }

    if (league) {
      query['league.id'] = league;
    }

    if (statusType) {
      query['status.type'] = { $in: statusType };
    }

    if (status) {
      query['status.short'] = status;
    }

    const matches = await this.repository.findAll(query, {
      orderBy: 'date',
    });

    return matches.map((match) => ({
      ...match,
      date: dayjs.utc(match.date).tz(timezone).format(),
      timezone,
    }));
  }
}
