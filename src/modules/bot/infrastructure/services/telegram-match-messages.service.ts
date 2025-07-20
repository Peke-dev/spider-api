import { Injectable } from '@nestjs/common';
import { Match, MatchLeague, Venue, MatchTypeEnum } from '@modules/matches';
import { escapeMkdnV2, applyBold, getCountryFlag } from '../../utils';
import * as dayjs from 'dayjs';
import * as utc from 'dayjs/plugin/utc';
import * as timezone from 'dayjs/plugin/timezone';
dayjs.extend(utc);
dayjs.extend(timezone);

@Injectable()
export class TelegramMatchMessagesService {
  getResultText(goals: number | null): string {
    if (!goals && goals !== 0) return '';
    return escapeMkdnV2(`(${goals})`);
  }

  getVenueText(venue: Venue): string {
    let venueName = venue?.name || 'Estadio desconocido';
    if (venueName.split(' ').length > 2) {
      venueName = venueName.split(' ')[0] + ' ' + venueName.split(' ')[1];
    }
    const venueCity = venue?.city ? `, ${venue.city}` : '';
    return `📍 ${venueName}${venueCity}`;
  }

  getMatchTimeText(match: Match): string {
    const { type, elapsed, long } = match.status;

    if (type === MatchTypeEnum.FINISHED) {
      return '';
    }

    const time = dayjs(match.date).format('HH:mm');

    const matchStatusText = {
      [MatchTypeEnum.IN_PLAY]: `${elapsed}' ${long}`,
      [MatchTypeEnum.SCHEDULED]: `${time} ${long}`,
      [MatchTypeEnum.POSTPONED]: long,
    };

    return escapeMkdnV2(`⏰ ${matchStatusText[type]}`);
  }

  getMatchTeamsStatusText(match: Match): string {
    const { home, away } = match.teams;
    const { type } = match.status;
    const matchStatusIcon = {
      [MatchTypeEnum.FINISHED]: '✅',
      [MatchTypeEnum.IN_PLAY]: '🟢',
      [MatchTypeEnum.SCHEDULED]: '⚽',
      [MatchTypeEnum.POSTPONED]: '🟡',
    };
    const homeResult = this.getResultText(match.goals.home);
    const awayResult = this.getResultText(match.goals.away);
    const homeTeamText = `${escapeMkdnV2(home.name)} ${homeResult}`;
    const awayTeamText = `${awayResult} ${escapeMkdnV2(away.name)}`;
    return `${matchStatusIcon[type]}  ${
      home.winner ? applyBold(homeTeamText) : homeTeamText
    } vs ${away.winner ? applyBold(awayTeamText) : awayTeamText}`;
  }

  getLeagueMatchMessage(matches: Match[], league: MatchLeague): string {
    let message = escapeMkdnV2(
      `${getCountryFlag(league.country)}  ${league.name} - ${league.round}\n\n`,
    );

    const matchesOrdered = [
      ...matches.filter((match) => match.status.type === MatchTypeEnum.IN_PLAY),
      ...matches.filter(
        (match) => match.status.type === MatchTypeEnum.SCHEDULED,
      ),
      ...matches.filter(
        (match) => match.status.type === MatchTypeEnum.POSTPONED,
      ),
      ...matches.filter(
        (match) => match.status.type === MatchTypeEnum.FINISHED,
      ),
    ];

    matchesOrdered.forEach((match) => {
      const matchTime = this.getMatchTimeText(match);

      message += `${this.getMatchTeamsStatusText(match)}  \n`;

      if (matchTime) {
        message += `${matchTime}\n\n`;
      }
    });

    return message.trim();
  }
}
