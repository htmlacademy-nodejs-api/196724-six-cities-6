import { StatusCodes } from 'http-status-codes';
import {BaseAuthException} from './base-auth.exeption.js';

export class UserPasswordIncorrectException extends BaseAuthException {
  constructor() {
    super(StatusCodes.UNAUTHORIZED, 'Incorrect user name or password');
  }
}
