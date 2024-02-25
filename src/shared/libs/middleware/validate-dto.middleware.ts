import { NextFunction, Request, Response } from 'express';
import { ClassConstructor, plainToInstance } from 'class-transformer';
import { StatusCodes } from 'http-status-codes';
import { IMiddleware } from './middleware.interface.js';
import { ObjectSchema, ValidationError } from 'joi';

export class ValidateDtoMiddleware implements IMiddleware {
  constructor(
    private dto: ClassConstructor<object>, private validator: ObjectSchema
  ) {}

  public async execute({ body }: Request, res: Response, next: NextFunction): Promise<void> {
    const dtoInstance = plainToInstance(this.dto, body);
    try {
      await this.validator.validateAsync(dtoInstance, { abortEarly: false, stripUnknown: true  });
      return next();

    } catch (e: unknown) {
      res.status(StatusCodes.BAD_REQUEST)
        .send((e as ValidationError)?.details.map((detail) => detail.message).join('; \n'));
    }
  }
}
