import { Controller, Get, HttpStatus } from '@nestjs/common';
import { Public } from '@common/decorators';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

export interface AppInfoInterface {
  name?: string;
  version?: string;
}

@ApiTags('App')
@Controller(['/', '/ping'])
export class AppController {
  @Get()
  @Public()
  @ApiOperation({
    summary: 'Create a new league',
    operationId: 'Create League',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'The app info has been successfully retrieved.',
  })
  getAppInfo(): AppInfoInterface {
    return {
      name: 'spider-api',
      version: '0.0.2',
    };
  }
}
