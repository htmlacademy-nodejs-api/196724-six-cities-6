import { inject, injectable } from 'inversify';
import { NextFunction, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { ValidationError } from '../errors/index.js';
import { ApplicationErrorType, Components } from '../../types/index.js';
import { ILogger } from '../logger/index.js';
import { createErrorObject } from '../../utils/index.js';
import { IExceptionFilter } from './exeption-filter.interface.js';

@injectable()
export class ValidationExceptionFilter implements IExceptionFilter {
  constructor(
    @inject(Components.Logger) private readonly logger: ILogger
  ) {
    this.logger.info('Register ValidationExceptionFilter');
  }

  public catch(error: unknown, _req: Request, res: Response, next: NextFunction): void {
    if (!(error instanceof ValidationError)) {
      return next(error);
    }

    this.logger.error(`[ValidationException]: ${error.message}`, error);

    error.details.forEach(
      (errorField) => this.logger.warn(`[${errorField.property}] — ${errorField.message}`)
    );

    res
      .status(StatusCodes.BAD_REQUEST)
      .json(createErrorObject(ApplicationErrorType.ValidationError, error.message, error.details));
  }
}
