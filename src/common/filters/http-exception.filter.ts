import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
} from '@nestjs/common';
import type { Request, Response } from 'express';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const context = host.switchToHttp();
    const request = context.getRequest<Request>();
    const response = context.getResponse<Response>();
    const statusCode = exception.getStatus();
    const exceptionResponse = exception.getResponse();
    const responseBody =
      typeof exceptionResponse === 'object' && exceptionResponse !== null
        ? (exceptionResponse as {
            code?: string;
            details?: unknown;
            message?: string | string[];
          })
        : undefined;
    const message =
      typeof exceptionResponse === 'string'
        ? exceptionResponse
        : responseBody?.message;

    response.status(statusCode).json({
      statusCode,
      ...(responseBody?.code ? { code: responseBody.code } : {}),
      ...(responseBody?.details ? { details: responseBody.details } : {}),
      message: message ?? exception.message,
      path: request.url,
      timestamp: new Date().toISOString(),
    });
  }
}
