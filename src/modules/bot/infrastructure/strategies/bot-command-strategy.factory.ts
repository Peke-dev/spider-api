import { Inject } from '@nestjs/common';
import { Context } from 'grammy';
import { BotCommandStrategyInterface } from '../../interfaces';

export class BotCommandStrategyFactory {
  readonly commands: string[] = [];
  private readonly commandStrategies: BotCommandStrategyInterface[];

  constructor(
    @Inject('BOT_COMMANDS_LIST')
    private readonly botCommandsList: BotCommandStrategyInterface[],
  ) {
    this.commands = this.botCommandsList.flatMap((command) => command.command);
    this.commandStrategies = this.botCommandsList;
  }

  async execute(command: string, ctx: Context) {
    const commandStrategy = this.commandStrategies.find((strategy) =>
      strategy.command.includes(command),
    );

    if (!commandStrategy) {
      return;
    }

    return commandStrategy.execute(ctx);
  }
}
