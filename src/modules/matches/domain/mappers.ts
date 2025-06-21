import { MatchShortStatusEnum, MatchTypeEnum } from './enums';
import { IMatchStatus } from './interfaces';

export const matchStatusMapper: IMatchStatus[] = [
  {
    short: MatchShortStatusEnum.TBD,
    long: 'Time To Be Defined',
    type: MatchTypeEnum.SCHEDULED,
    description: 'Scheduled but date and time are not known',
  },
  {
    short: MatchShortStatusEnum.NS,
    long: 'Not Started',
    type: MatchTypeEnum.SCHEDULED,
    description: 'Not Started',
  },
  {
    short: MatchShortStatusEnum.ONE_H,
    long: 'First Half, Kick Off',
    type: MatchTypeEnum.IN_PLAY,
    description: 'First half in play',
  },
  {
    short: MatchShortStatusEnum.HT,
    long: 'Halftime',
    type: MatchTypeEnum.IN_PLAY,
    description: 'Finished in the regular time',
  },
  {
    short: MatchShortStatusEnum.TWO_H,
    long: 'Second Half, 2nd Half Started',
    type: MatchTypeEnum.IN_PLAY,
    description: 'Second half in play',
  },
  {
    short: MatchShortStatusEnum.ET,
    long: 'Extra Time',
    type: MatchTypeEnum.IN_PLAY,
    description: 'Extra time in play',
  },
  {
    short: MatchShortStatusEnum.BT,
    long: 'Break Time',
    type: MatchTypeEnum.IN_PLAY,
    description: 'Break during extra time',
  },
  {
    short: MatchShortStatusEnum.P,
    long: 'Penalty In Progress',
    type: MatchTypeEnum.IN_PLAY,
    description: 'Penalty played after extra time',
  },
  {
    short: MatchShortStatusEnum.SUSP,
    long: 'Match Suspended',
    type: MatchTypeEnum.IN_PLAY,
    description:
      "Suspended by referee's decision, may be rescheduled another day",
  },
  {
    short: MatchShortStatusEnum.INT,
    long: 'Match Interrupted',
    type: MatchTypeEnum.IN_PLAY,
    description:
      "Interrupted by referee's decision, should resume in a few minutes",
  },
  {
    short: MatchShortStatusEnum.FT,
    long: 'Match Finished',
    type: MatchTypeEnum.FINISHED,
    description: 'Finished in the regular time',
  },
  {
    short: MatchShortStatusEnum.AET,
    long: 'Match Finished',
    type: MatchTypeEnum.FINISHED,
    description:
      'Finished after extra time without going to the penalty shootout',
  },
  {
    short: MatchShortStatusEnum.PEN,
    long: 'Match Finished',
    type: MatchTypeEnum.FINISHED,
    description: 'Finished after the penalty shootout',
  },
  {
    short: MatchShortStatusEnum.PST,
    long: 'Match Postponed',
    type: MatchTypeEnum.POSTPONED,
    description:
      'Postponed to another day, once the new date and time is known the status will change to Not Started',
  },
  {
    short: MatchShortStatusEnum.CANC,
    long: 'Match Cancelled',
    type: MatchTypeEnum.CANCELLED,
    description: 'Match will not be played',
  },
  {
    short: MatchShortStatusEnum.ABD,
    long: 'Match Abandoned',
    type: MatchTypeEnum.ABANDONED,
    description:
      'Abandoned for various reasons (Bad Weather, Safety, Floodlights, Playing Staff Or Referees). Can be rescheduled or not, it depends on the competition',
  },
  {
    short: MatchShortStatusEnum.AWD,
    long: 'Technical Loss',
    type: MatchTypeEnum.NOT_PLAYED,
    description: 'Victory by forfeit or absence of competitor',
  },
  {
    short: MatchShortStatusEnum.WO,
    long: 'WalkOver',
    type: MatchTypeEnum.NOT_PLAYED,
    description: 'Victory by forfeit or absence of competitor',
  },
  {
    short: MatchShortStatusEnum.LIVE,
    long: 'In Progress',
    type: MatchTypeEnum.IN_PLAY,
    description:
      'Used in very rare cases. It indicates a fixture in progress but the data indicating the half-time or elapsed time are not available',
  },
];

export function getMatchTypeByStatus(
  status: MatchShortStatusEnum,
): MatchTypeEnum | undefined {
  const matchStatus = matchStatusMapper.find(
    (matchStatus) => matchStatus.short === status,
  );

  return matchStatus?.type;
}
