import { DynamicModule, Module } from '@nestjs/common';
import { LoggerModule as PinoLoggerModule, Params } from 'nestjs-pino';
import { LoggerService } from './services';

const defaultPinoParams: Params = {
  pinoHttp: {
    level: process.env.NODE_ENV === 'dev' ? 'debug' : 'info',
    customProps: (req, res) => ({
      context: 'HTTP',
      method: req.method,
      url: req.url,
      statusCode: res.statusCode,
    }),
    customLogLevel: (req, res, err) => {
      if (res.statusCode >= 400 && res.statusCode < 500) return 'warn';
      if (res.statusCode >= 500) return 'error';
      if (err) return 'error';
      return 'info';
    },
    customSuccessMessage: (req, res) => {
      return `${req.method} ${req.url} - ${res.statusCode}`;
    },
    customErrorMessage: (req, res, err) => {
      return `${req.method} ${req.url} - ${res.statusCode} - ${err.message}`;
    },
  },
  forRoutes: ['*'],
  exclude: ['/health', '/ping', '/docs', '/docs-json', '/docs-yaml'],
};

const devTargets = [
  {
    level: process.env.NODE_ENV === 'dev' ? 'debug' : 'info',
    target: 'pino-pretty',
    options: {
      colorize: true,
      levelFirst: true,
      translateTime: 'dd-mm-yyyy HH:MM:ss',
      messageFormat: '[{context}] {msg}',
      hideObject: true,
      messageKey: 'msg',
      ignore: 'pid,hostname',
    },
  },
];

@Module({})
export class LoggerModule {
  static forRoot(options: { env: string }): DynamicModule {
    let pinoParams: Params = defaultPinoParams;

    if (options.env === 'dev') {
      pinoParams = {
        pinoHttp: {
          ...defaultPinoParams.pinoHttp,
          transport: {
            targets: devTargets,
          },
        },
      };
    }

    return {
      module: LoggerModule,
      imports: [PinoLoggerModule.forRoot(pinoParams)],
      providers: [LoggerService],
      exports: [LoggerService],
      global: true,
    };
  }
}
