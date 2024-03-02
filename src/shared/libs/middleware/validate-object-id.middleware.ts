import { IMiddleware } from './middleware.interface.js';
import { NextFunction, Request, Response } from 'express';
import { Types } from 'mongoose';
import { StatusCodes } from 'http-status-codes';
import { HttpError } from '../errors/index.js';

export class ValidateObjectIdMiddleware implements IMiddleware {
  constructor(
    private params: string[]
  ) {}

  public execute({ params }: Request, _res: Response, next: NextFunction): void {
    const objectIds: string[] = Object.entries(params)
      .filter(([key]) => this.params.includes(key))
      .map(([, value]) => value);

    const invalidIds = objectIds.filter((id: string) => !Types.ObjectId.isValid(id));

    if (!invalidIds.length) {
      return next();
    }

    throw new HttpError(
      StatusCodes.BAD_REQUEST,
      `Invalid ObjectID(s): ${invalidIds.join(',')}`,
      'ValidateObjectIdMiddleware'
    );
  }
}
