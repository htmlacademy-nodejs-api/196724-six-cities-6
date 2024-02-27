import { ClassConstructor, plainToInstance } from 'class-transformer';
import { TokenPayload } from '../modules/auth/index.js';

export function fillDto<T, V>(someDto: ClassConstructor<T>, plainObject: V) {
  return plainToInstance(someDto, plainObject, {excludeExtraneousValues: true, exposeUnsetFields: false});
}

export function createErrorObject(message: string) {
  return {
    error: message,
  };
}

export const isTokenPayload = (payload: unknown): payload is TokenPayload => (
  (typeof payload === 'object' && payload !== null) &&
  ('id' in payload && typeof payload.id === 'string')
);
