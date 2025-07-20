import { Injectable } from '@nestjs/common';
import { Context } from 'grammy';
import {
  createMatchLeagueFromMatchListFactory,
  DateStringEnum,
  FindAllMatchesUseCase,
  MatchTypeEnum,
} from '@modules/matches';
import { BotCommandStrategyInterface } from '../../interfaces';
import { GetChatByIdUseCase } from '../../application/use-cases';
import { TelegramMatchMessagesService } from '../services/telegram-match-messages.service';

@Injectable()
export class TodayFinishedMatchesCommand
  implements BotCommandStrategyInterface
{
  command = ['hoy_terminados', 'today_finished'];

  constructor(
    private readonly telegramMatchMessagesService: TelegramMatchMessagesService,
    private readonly getChatByIdUseCase: GetChatByIdUseCase,
    private readonly findAllMatchesUseCase: FindAllMatchesUseCase,
  ) {}

  async execute(ctx: Context) {
    if (!ctx.chat?.id) return;

    const chat = await this.getChatByIdUseCase.execute(ctx.chat.id);

    if (!chat) return;

    const { subscriptions } = chat;

    const matches = await this.findAllMatchesUseCase.execute({
      dateString: DateStringEnum.TODAY,
      statusType: [MatchTypeEnum.FINISHED],
      league: subscriptions.leagues,
    });

    const leagueMatches = createMatchLeagueFromMatchListFactory(matches);

    if (!matches || !matches.length) {
      ctx.reply(`🧑🏾‍🦯‍➡️ There are no finished matches for today`);
      return;
    }

    for (const league of leagueMatches) {
      const { matches = [] } = league;
      ctx
        .reply(
          this.telegramMatchMessagesService.getLeagueMatchMessage(
            matches,
            league,
          ),
          {
            parse_mode: 'MarkdownV2',
            disable_notification: false,
          },
        )
        .catch((error) => {
          console.error('error sending message', error);
        });
    }
  }
}
