/* eslint-disable no-debugger */
import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  HttpStatus,
  // HttpStatus,
  // Response,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export interface Response<T> {
  message: string;
  status: number;
  data?: T;
  err?: string[];
}

@Injectable()
export class ResponseInterceptor<T> implements NestInterceptor<T, Response<T>> {
  constructor() {
    //
  }
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<Response<T>> {
    const response: any = context.switchToHttp().getResponse();
    return next.handle().pipe(
      map((result) => {
        if (!result.message) {
          result.message = '';
        }
        if (!result.status) {
          result.status = HttpStatus.OK;
        }
        result._time = new Date();
        response.status(result.status);
        return result;
      }),
    );
  }
}
