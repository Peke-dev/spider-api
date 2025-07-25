import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Response } from 'express';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class ResponseInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const response = context.switchToHttp().getResponse<Response>();

    return next.handle().pipe(
      map((res: any) => {
        const { total, data } = res;

        if (total && data) {
          return {
            statusCode: response.statusCode,
            data,
            length: data.length,
            total,
          };
        }

        return {
          statusCode: response.statusCode,
          data: res,
          total,
        };
      }),
    );
  }
}
