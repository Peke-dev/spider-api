import { Injectable } from '@nestjs/common';
import { InlineKeyboard } from 'grammy';
import { BotCommandStrategyInterface, MyContext } from '../../interfaces';
import { FindAllLeaguesUseCase } from '@modules/leagues/application/use-cases';
import {
  CreateChatUseCase,
  GetChatByIdUseCase,
} from '../../application/use-cases';
import { getCountryFlag } from '@modules/bot/utils';

@Injectable()
export class ChatSubLeaguesCommand implements BotCommandStrategyInterface {
  command = ['sub_leagues', 'sub_ligas'];

  constructor(
    private readonly findAllLeaguesUseCase: FindAllLeaguesUseCase,
    private readonly createChatUseCase: CreateChatUseCase,
    private readonly getChatByIdUseCase: GetChatByIdUseCase,
  ) {}

  async execute(ctx: MyContext) {
    if (!ctx.chat?.id) return;

    let chat = await this.getChatByIdUseCase.execute(ctx.chat.id);

    if (!chat) {
      chat = await this.createChatUseCase.execute({
        id: ctx.chat.id,
      });
    }

    const leagues = await this.findAllLeaguesUseCase.execute({
      status: 'enabled',
    });

    const leaguesSelected = chat.subscriptions.leagues;

    const leaguesButtons: {
      text: string;
      value: string;
    }[] = [];

    const leaguesKeyboard = new InlineKeyboard();

    for (const league of leagues) {
      if (!league.id) continue;

      const buttonValue = `sub_league:${league.id}`;
      const bottonText = `${league.name} ${getCountryFlag(league.country.name)}`;

      leaguesButtons.push({
        text: bottonText,
        value: buttonValue,
      });

      if (leaguesSelected.includes(league.id)) {
        leaguesKeyboard.text(`✅ ${bottonText}`, buttonValue).row();
        continue;
      }

      leaguesKeyboard.text(bottonText, buttonValue).row();
    }

    leaguesKeyboard.text('Finalizar', 'sub_league:finish').row();

    ctx.session['buttons'] = leaguesButtons;
    ctx.session['leaguesSelected'] = leaguesSelected;

    await ctx.reply('Selecciona las ligas que quieres seguir: ⚽️', {
      reply_markup: leaguesKeyboard,
    });
  }
}
