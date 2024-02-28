import {HttpError} from './http-error.js';

export class BaseAuthException extends HttpError {
  constructor(status: number, message: string) {
    super(status, message);
  }
}
