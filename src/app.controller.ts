import { Controller, Get } from '@nestjs/common';

export interface AppInfoInterface {
  name?: string;
  version?: string;
}

@Controller('/')
export class AppController {
  @Get()
  getAppInfo(): AppInfoInterface {
    return {
      name: 'spider-api',
      version: '0.0.1',
    };
  }
}
