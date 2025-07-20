import { Injectable } from '@nestjs/common';
import { Context } from 'grammy';
import {
  createMatchLeagueFromMatchListFactory,
  FindAllMatchesUseCase,
  DateStringEnum,
} from '@modules/matches';
import { BotCommandStrategyInterface } from '../../interfaces';
import { TelegramMatchMessagesService } from '../services/telegram-match-messages.service';
import { GetChatByIdUseCase } from '@modules/bot/application/use-cases/get-chat-by-id.use-case';

@Injectable()
export class TodayMatchesCommand implements BotCommandStrategyInterface {
  command = ['today', 'hoy'];

  constructor(
    private readonly telegramMatchMessagesService: TelegramMatchMessagesService,
    private readonly findAllMatchesUseCase: FindAllMatchesUseCase,
    private readonly getChatByIdUseCase: GetChatByIdUseCase,
  ) {}

  async execute(ctx: Context) {
    if (!ctx.chat?.id) return;

    const chat = await this.getChatByIdUseCase.execute(ctx.chat.id);

    if (!chat) return;

    const { subscriptions } = chat;

    const matches = await this.findAllMatchesUseCase.execute({
      dateString: DateStringEnum.TODAY,
      league: subscriptions.leagues,
    });

    const leagueMatches = createMatchLeagueFromMatchListFactory(matches);

    if (!matches || !matches.length) {
      ctx.reply(`🧑🏾‍🦯‍➡️ There are no matches for today.`);
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
