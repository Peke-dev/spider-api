import { Inject } from '@nestjs/common';
import { BotCbQueryStrategyInterface, MyContext } from '../../interfaces';

export class BotCbQueryStrategyFactory {
  readonly queries: (RegExp | string)[] = [];
  private readonly cbQueryStrategies: BotCbQueryStrategyInterface[];

  constructor(
    @Inject('BOT_CB_QUERIES_LIST')
    private readonly botCbQueriesList: BotCbQueryStrategyInterface[],
  ) {
    this.queries = this.botCbQueriesList.flatMap((query) => query.query);
    this.cbQueryStrategies = this.botCbQueriesList;
  }

  async execute(query: RegExp | string, ctx: MyContext) {
    const cbQueryStrategy = this.cbQueryStrategies.find((strategy) =>
      strategy.query.includes(query),
    );

    if (!cbQueryStrategy) {
      return;
    }

    return cbQueryStrategy.execute(ctx);
  }
}
