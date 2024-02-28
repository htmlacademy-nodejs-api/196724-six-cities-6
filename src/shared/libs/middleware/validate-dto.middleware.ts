import { NextFunction, Request, Response } from 'express';
import { ClassConstructor, plainToInstance } from 'class-transformer';
import { IMiddleware } from './middleware.interface.js';
import Joi, { ObjectSchema } from 'joi';
import {reduceValidationErrors} from '../../utils/index.js';
import {ValidationError} from '../errors/index.js';

export class ValidateDtoMiddleware implements IMiddleware {
  constructor(
    private dto: ClassConstructor<object>, private validator: ObjectSchema
  ) {}

  public async execute({ body, path }: Request, _res: Response, next: NextFunction): Promise<void> {
    const dtoInstance = plainToInstance(this.dto, body);
    try {
      await this.validator.validateAsync(dtoInstance, { abortEarly: false, stripUnknown: true });
      return next();

    } catch (e: unknown) {
      throw new ValidationError(
        `Validation error: ${path}`,
        reduceValidationErrors((e as Joi.ValidationError).details)
      );
    }
  }
}
