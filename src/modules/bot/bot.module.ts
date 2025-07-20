import {
  Module,
  NestModule,
  MiddlewareConsumer,
  Inject,
  DynamicModule,
} from '@nestjs/common';
import { MongooseModule, getModelToken } from '@nestjs/mongoose';
import { Bot, session, webhookCallback } from 'grammy';
import { Model } from 'mongoose';

import { MatchesModule } from '@modules/matches';
import { LeaguesModule } from '@modules/leagues';

import {
  BotCbQueryStrategyInterface,
  BotCommandStrategyInterface,
  MyContext,
  BotModuleOptions,
  BotModuleAsyncOptions,
} from './interfaces';
import * as Commands from './infrastructure/commands';
import * as UseCases from './application/use-cases';
import * as Cbs from './infrastructure/cb-queries';
import * as Strategies from './infrastructure/strategies';
import { TelegramMatchMessagesService } from './infrastructure/services/telegram-match-messages.service';
import {
  BotCbQueryStrategyFactory,
  BotCommandStrategyFactory,
} from './infrastructure/strategies';
import { ChatRepository } from './domain';
import { MongooseChatRepository } from './infrastructure/repositories';
import {
  CHAT_COLLECTION,
  ChatDocument,
  ChatSchema,
} from './infrastructure/schemas';
import { BOT_NAME, commandsEs, commandsEn } from './constants';

import * as dayjs from 'dayjs';
import * as utc from 'dayjs/plugin/utc';
import * as timezone from 'dayjs/plugin/timezone';

dayjs.extend(utc);
dayjs.extend(timezone);

// export function adapter<T>(data: T) {
//   return {
//     read: (key: string) => {
//       return data[key];
//     },
//     write: (key: string, value: T) => {
//       data[key] = value;
//     },
//     delete: (key: string) => {
//       delete data[key];
//     },
//   };
// }

@Module({
  imports: [
    MatchesModule,
    LeaguesModule,
    MongooseModule.forFeature([{ name: CHAT_COLLECTION, schema: ChatSchema }]),
  ],
  providers: [
    ...Object.values(UseCases),
    ...Object.values(Commands),
    ...Object.values(Cbs),
    ...Object.values(Strategies),
    TelegramMatchMessagesService,
    {
      provide: ChatRepository,
      useFactory: (chatModel: Model<ChatDocument>) => {
        return new MongooseChatRepository(chatModel);
      },
      inject: [getModelToken(CHAT_COLLECTION)],
    },
    {
      provide: BOT_NAME,
      useFactory: (config: BotModuleOptions) =>
        new Bot<MyContext>(config.token),
      inject: ['BOT_CONFIG'],
    },
    {
      provide: 'BOT_COMMANDS_LIST',
      useFactory: (...commands: BotCommandStrategyInterface[]) => {
        return commands;
      },
      inject: [...Object.values(Commands)],
    },
    {
      provide: 'BOT_CB_QUERIES_LIST',
      useFactory: (...queries: BotCbQueryStrategyInterface[]) => {
        return queries;
      },
      inject: [...Object.values(Cbs)],
    },
  ],
})
export class BotModule implements NestModule {
  constructor(
    @Inject(BOT_NAME)
    private readonly bot: Bot<MyContext>,
    private readonly botCommandStrategyFactory: BotCommandStrategyFactory,
    private readonly botCbQueryStrategyFactory: BotCbQueryStrategyFactory,
  ) {}

  async configure(consumer: MiddlewareConsumer) {
    this.bot.use(
      session({
        initial: () => ({
          leaguesSelected: [],
          buttons: [],
        }),
      }),
    );
    // this.bot.use(ResponseTime);

    await this.bot.api.setMyCommands(commandsEs, { language_code: 'es' });
    await this.bot.api.setMyCommands(commandsEn, { language_code: 'en' });

    // // Create a simple menu.
    // const menu = new Menu('my-menu-identifier')
    //   .text('A', (ctx) => ctx.reply('You pressed A!'))
    //   .row()
    //   .text('B', (ctx) => ctx.reply('You pressed B!'));

    // // Make it interactive.
    // this.bot.use(menu);

    const webhookRoute = '/bot';
    // await this.bot.api.setWebhook(
    //   `https://loved-proud-sunbird.ngrok-free.app${webhookRoute}`,
    // );

    const commands = this.botCommandStrategyFactory.commands;
    const queries = this.botCbQueryStrategyFactory.queries;

    for (const command of commands) {
      this.bot.command(command, (ctx) => {
        this.botCommandStrategyFactory.execute(command, ctx).catch((error) => {
          console.error(`Error executing command ${command}:`);
          console.error(error);
        });
      });
    }

    for (const query of queries) {
      this.bot.callbackQuery(query, (ctx) => {
        this.botCbQueryStrategyFactory.execute(query, ctx).catch((error) => {
          console.error(`Error executing query ${query}:`);
          console.error(error);
        });
      });
    }

    consumer
      .apply(webhookCallback(this.bot, 'express'))
      .forRoutes(webhookRoute);
  }

  static register(options: BotModuleOptions): DynamicModule {
    return {
      module: BotModule,
      providers: [BotModule.getBotConfigProvider(options)],
    };
  }

  static getBotConfigProvider(options: BotModuleOptions) {
    return {
      provide: 'BOT_CONFIG',
      useFactory: () => options,
    };
  }

  static registerAsync(options: BotModuleAsyncOptions): DynamicModule {
    return {
      module: BotModule,
      providers: [
        {
          provide: 'BOT_CONFIG',
          useFactory: options.useFactory,
          inject: options.inject,
        },
      ],
    };
  }
}
