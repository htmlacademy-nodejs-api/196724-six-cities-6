import { inject, injectable } from 'inversify';
import { NextFunction, Request, Response } from 'express';
import { IExceptionFilter } from './exeption-filter.interface.js';
import { ILogger} from '../logger/index.js';
import { BaseAuthException } from '../errors/index.js';
import { ApplicationErrorType, Components } from '../../types/index.js';


@injectable()
export class AuthExceptionFilter implements IExceptionFilter {
  constructor(
    @inject(Components.Logger) private readonly logger: ILogger
  ) {
    this.logger.info('Register AuthExceptionFilter');
  }

  public catch(error: unknown, _req: Request, res: Response, next: NextFunction): void {
    if (!(error instanceof BaseAuthException)) {
      return next(error);
    }

    this.logger.error(`[AuthModule] ${error.message}`, error);
    res.status(error.httpStatusCode)
      .json({
        type: ApplicationErrorType.Authorisation,
        error: error.message,
      });
  }
}
