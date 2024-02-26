import { HttpError } from '../../../libs/exeption-filter/index.js';

export class BaseAuthException extends HttpError {
  constructor(status: number, message: string) {
    super(status, message);
  }
}
