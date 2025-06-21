import { MatchShortStatusEnum, MatchTypeEnum } from './enums';

export interface IMatchStatus {
  short: MatchShortStatusEnum;
  long: string;
  type: MatchTypeEnum;
  description: string;
}
