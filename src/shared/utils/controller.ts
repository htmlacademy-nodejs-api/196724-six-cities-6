import { ClassConstructor, plainToInstance } from 'class-transformer';
import { TokenPayload } from '../modules/auth/index.js';
import {ApplicationError, ValidationErrorField} from '../types/index.js';
import { ValidationErrorItem } from 'joi';

export function fillDto<T, V>(someDto: ClassConstructor<T>, plainObject: V) {
  return plainToInstance(someDto, plainObject, {excludeExtraneousValues: true, exposeUnsetFields: false});
}

export function createErrorObject(errorType: ApplicationError, error: string, details: ValidationErrorField[] = []) {
  return { errorType, error, details };
}

export const isTokenPayload = (payload: unknown): payload is TokenPayload => (
  (typeof payload === 'object' && payload !== null) &&
  ('id' in payload && typeof payload.id === 'string')
);

export const reduceValidationErrors = (errors: ValidationErrorItem[]): ValidationErrorField[] =>
  errors.map(({ message, context}) => ({
    property: context?.key,
    value: context?.value,
    message
  }));
