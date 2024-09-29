import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable()
export class ErrorInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      catchError((error) => {
        // Check if the error is an instance of HttpException
        if (error instanceof HttpException) {
          throw error;
        } else if (error instanceof Error) {
          // If the error is a plain JavaScript Error, wrap it in a HttpException with status 500 (Internal Server Error)
          throw new HttpException(
            error.message,
            HttpStatus.INTERNAL_SERVER_ERROR,
          );
        } else {
          console.log(error.message, '3');
          // If the error is not a JavaScript Error, it may be a string or another data type
          // Wrap it in a HttpException with status 500 and the error as the message
          throw new HttpException(error, HttpStatus.INTERNAL_SERVER_ERROR);
        }
      }),
    );
  }
}
