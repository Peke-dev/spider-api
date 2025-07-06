import { Controller, Get, HttpStatus } from '@nestjs/common';
import { Public } from '@common/decorators';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

export interface AppInfoInterface {
  name?: string;
  version?: string;
}

export interface PingResponseInterface {
  status: 'ok';
}

@ApiTags('App')
@Controller(['/'])
export class AppController {
  @Get()
  @Public()
  @ApiOperation({
    summary: 'Get app info',
    operationId: 'Get App Info',
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

  @Get('ping')
  @Public()
  @ApiOperation({
    summary: 'Get app ping status',
    operationId: 'Get App Ping Status',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'The app ping status has been successfully retrieved.',
  })
  ping(): PingResponseInterface {
    return {
      status: 'ok',
    };
  }
}
