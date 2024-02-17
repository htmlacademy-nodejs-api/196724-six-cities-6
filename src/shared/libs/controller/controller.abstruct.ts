import { injectable } from 'inversify';
import { StatusCodes } from 'http-status-codes';
import { RequestHandler, Response, Router } from 'express';
import asyncHandler from 'express-async-handler';
import { IController } from './controller.interface.js';
import { ILogger } from '../logger/index.js';
import { Route } from './types/index.js';
import { IMiddleware } from '../middleware/index.js';


const DEFAULT_CONTENT_TYPE = 'application/json';

@injectable()
export abstract class Controller implements IController {
  private readonly _router: Router;

  constructor(
    protected readonly logger: ILogger
  ) {
    this._router = Router();
  }

  get router() {
    return this._router;
  }

  public addRoute(route: Route) {
    const wrapperAsyncHandler = asyncHandler(route.handler.bind(this));
    const middlewareHandler = route.middleware?.
      map((item: IMiddleware) => asyncHandler(item.execute.bind(item)));
    const handler: RequestHandler | RequestHandler[] = middlewareHandler && middlewareHandler.length ?
      [...middlewareHandler, wrapperAsyncHandler] : wrapperAsyncHandler;

    this._router[route.method](route.path, handler);
    this.logger.info(`Route registered: ${route.method.toUpperCase()} ${route.path}`);
  }

  public send<T>(res: Response, statusCode: number, data: T): void {
    res
      .type(DEFAULT_CONTENT_TYPE)
      .status(statusCode)
      .json(data);
  }

  public created<T>(res: Response, data: T): void {
    this.send(res, StatusCodes.CREATED, data);
  }

  public noContent<T>(res: Response, data: T): void {
    this.send(res, StatusCodes.NO_CONTENT, data);
  }

  public success<T>(res: Response, data: T): void {
    this.send(res, StatusCodes.OK, data);
  }
}
