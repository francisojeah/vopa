import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
} from '@nestjs/common';

@Catch(HttpException)
export class ErrorFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const status = exception.getStatus();
    const errorResponse = exception.getResponse();

    const errorMessage =
      typeof errorResponse === 'object' && errorResponse['message']
        ? errorResponse['message']
        : errorResponse;

    response.status(status).json({
      error: {
        statusCode: status,
        message: errorMessage || 'Something went wrong',
      },
    });
  }
}
