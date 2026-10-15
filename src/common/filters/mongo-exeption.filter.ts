import { ArgumentsHost, Catch, ExceptionFilter, HttpStatus } from '@nestjs/common';
import { Response } from 'express';
import { MongoDuplicateKeyError } from '../interfaces/errors/mongo-duplicate-key.error.js';

@Catch()
export class MongoExeptionFilter<T> implements ExceptionFilter {

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    if (this.isMongoDuplicateKeyError(exception)) {
      const [field, value] = Object.entries(exception.keyValue)[0];

      return response.status(HttpStatus.BAD_REQUEST).json({
        statusCode: HttpStatus.BAD_REQUEST,
        error: 'Duplicate Key',
        message: 'Resource already exists',
        conflict: {
          field,
          value
        }
      });
    }

    throw exception;

  }

  private isMongoDuplicateKeyError(exception: unknown): exception is MongoDuplicateKeyError {
    return (
      typeof exception === 'object' &&
      exception !== null &&
      'code' in exception &&
      (exception as MongoDuplicateKeyError).code === 11000 &&
      'keyValue' in exception
    );
  }
}
