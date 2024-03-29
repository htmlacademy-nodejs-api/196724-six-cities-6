import { NextFunction, Request, Response, } from 'express';
import { HttpMethod } from './http-method.enums.js';
import { IMiddleware } from '../../middleware/index.js';

export interface Route {
  path: string;
  method: HttpMethod;
  handler: (req: Request, res: Response, next: NextFunction) => void;
  middleware?: IMiddleware[];
}
