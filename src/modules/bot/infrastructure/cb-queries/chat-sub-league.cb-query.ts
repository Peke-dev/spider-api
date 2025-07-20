import { Injectable } from '@nestjs/common';
import { InlineKeyboard } from 'grammy';
import { BotCbQueryStrategyInterface, MyContext } from '../../interfaces';
import { UpdateChatUseCase } from '../../application/use-cases';

@Injectable()
export class ChatSubLeagueCbQuery implements BotCbQueryStrategyInterface {
  query = [/^sub_league:/];

  constructor(private readonly updateChatUseCase: UpdateChatUseCase) {}

  async execute(ctx: MyContext) {
    const { callback_query } = ctx.update;
    const query = callback_query?.data;
    const leaguesSelected = ctx.session.leaguesSelected;
    let leaguesToUpdate: string[] = [...leaguesSelected];
    const buttons = ctx.session.buttons;

    if (query === 'sub_league:finish') {
      await ctx.deleteMessage();
      return;
    }

    if (!ctx.chat?.id) return;

    if (!query) return;

    const selectTedLeague = query.split(':')[1];

    const isLeagueSelected = leaguesSelected.includes(selectTedLeague);

    if (isLeagueSelected) {
      leaguesToUpdate = leaguesSelected.filter(
        (league) => league !== selectTedLeague,
      );
    } else {
      leaguesToUpdate.push(selectTedLeague);
    }

    await this.updateChatUseCase.execute(ctx.chat.id, {
      subscriptions: {
        leagues: leaguesToUpdate,
        matches: [],
      },
    });

    ctx
      .answerCallbackQuery({
        text: '✅ Leagues updated',
      })
      .catch((err) => {
        console.log('Error answering callback query', err);
      });

    const newB = new InlineKeyboard();

    for (const leagueButton of buttons) {
      const leagueId = leagueButton.value.split(':')[1];

      if (leaguesToUpdate.includes(leagueId)) {
        newB.text(`✅ ${leagueButton.text}`, leagueButton.value).row();
        continue;
      }

      newB.text(leagueButton.text, leagueButton.value).row();
    }

    ctx.session['leaguesSelected'] = leaguesToUpdate;
    ctx.session['buttons'] = buttons;

    newB.text('Finalizar', 'sub_league:finish').row();

    await ctx.editMessageReplyMarkup({
      reply_markup: newB,
    });

    return;
  }
}
