import { inject, injectable } from 'inversify';
import { StatusCodes } from 'http-status-codes';
import { NextFunction, Request, Response } from 'express';
import { IExceptionFilter} from './exeption-filter.interface.js';
import { ApplicationError, Components } from '../../types/index.js';
import { ILogger } from '../logger/index.js';
import { HttpError } from '../errors/index.js';
import { createErrorObject } from '../../utils/index.js';


@injectable()
export class HttpErrorExceptionFilter implements IExceptionFilter {
  constructor(
    @inject(Components.Logger) private readonly logger: ILogger
  ) {
    this.logger.info('Register HttpErrorExceptionFilter');
  }

  public catch(error: unknown, req: Request, res: Response, next: NextFunction): void {
    if (!(error instanceof HttpError)) {
      return next(error);
    }

    this.logger.error(`[HttpErrorException]: ${req.path} # ${error.message}`, error);

    res
      .status(StatusCodes.BAD_REQUEST)
      .json(createErrorObject(ApplicationError.CommonError, error.message));
  }
}
