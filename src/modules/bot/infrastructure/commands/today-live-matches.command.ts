import { Injectable } from '@nestjs/common';
import { Context } from 'grammy';
import {
  createMatchLeagueFromMatchListFactory,
  DateStringEnum,
  FindAllMatchesUseCase,
  MatchTypeEnum,
} from '@modules/matches';
import { BotCommandStrategyInterface } from '../../interfaces';
import { GetMatchesByDateAndStatusTypeUseCase } from '../../application/use-cases';
import { TelegramMatchMessagesService } from '../services/telegram-match-messages.service';
import { GetChatByIdUseCase } from '@modules/bot/application/use-cases/get-chat-by-id.use-case';

@Injectable()
export class TodayLiveMatchesCommand implements BotCommandStrategyInterface {
  command = ['hoy_live', 'today_live'];

  constructor(
    private readonly getMatchesByDateAndStatusTypeUseCase: GetMatchesByDateAndStatusTypeUseCase,
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
      statusType: [MatchTypeEnum.IN_PLAY],
      league: subscriptions.leagues,
    });

    const leagueMatches = createMatchLeagueFromMatchListFactory(matches);

    if (!matches || !matches.length) {
      ctx.reply(`🧑🏾‍🦯‍➡️ There are no live matches today.`);
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
