import { inject, injectable } from 'inversify';
import { IExceptionFilter } from './exeption-filter.interface.js';
import { ILogger } from '../logger/index.js';
import { ApplicationError, Components} from '../../types/index.js';
import { NextFunction, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { createErrorObject } from '../../utils/index.js';

@injectable()
export class AppExceptionFilter implements IExceptionFilter {
  constructor(
    @inject(Components.Logger) private readonly logger: ILogger
  ) {
    this.logger.info('Register AppExceptionFilter');
  }

  public catch(error: Error, _req: Request, res: Response, _next: NextFunction): void {
    this.logger.error(error.message, error);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json(createErrorObject(ApplicationError.ServiceError, error.message));
  }
}
