import { Logger, PinoLogger } from 'nestjs-pino';

export { Logger };

export class LoggerService extends PinoLogger {
  log(message: string, ...args: any[]) {
    super.info(message, ...args);
  }
}
