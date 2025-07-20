import { Injectable } from '@nestjs/common';
import { Context } from 'grammy';
import { BotCommandStrategyInterface } from '../../interfaces';

@Injectable()
export class StartCommand implements BotCommandStrategyInterface {
  command = ['start', 'inicio'];

  execute(ctx: Context) {
    ctx.reply('Hi start!');
  }
}
