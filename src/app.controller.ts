import { Controller, Get } from '@nestjs/common';
import { Public } from '@common/decorators';

export interface AppInfoInterface {
  name?: string;
  version?: string;
}

@Controller(['/', '/ping'])
export class AppController {
  @Get()
  @Public()
  getAppInfo(): AppInfoInterface {
    return {
      name: 'spider-api',
      version: '0.0.2',
    };
  }
}
