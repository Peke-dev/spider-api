import { MatchLeague, Match } from '@modules/matches';
import { Context, SessionFlavor } from 'grammy';

export interface SessionData {
  leaguesSelected: string[];
  buttons: {
    text: string;
    value: string;
  }[];
}

export interface MyContext extends Context, SessionFlavor<SessionData> {}

export interface BotCommandStrategyInterface {
  command: string[];
  execute(ctx: Context): Promise<void> | void;
}

export interface BotCbQueryStrategyInterface {
  query: (RegExp | string)[];
  execute(ctx: MyContext): Promise<void> | void;
}

export interface LeagueMatchesInterface {
  league: MatchLeague;
  matches: Omit<Match, 'eventExists'>[];
}

export interface BotModuleOptions {
  token: string;
}

export interface BotModuleAsyncOptions {
  useFactory: (...args: any[]) => Promise<BotModuleOptions> | BotModuleOptions;
  inject: any[];
}
