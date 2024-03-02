import { ApplicationErrorType } from './application-error.enum.js';

export type ApplicationError<T = unknown> = {
  error: string;
  errorType: ApplicationErrorType;
  details: T[]
}
