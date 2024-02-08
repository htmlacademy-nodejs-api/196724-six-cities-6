import { ILogger } from './logger.interface.js';
import { logError, logInfo } from '../../utils/index.js';
import { injectable } from 'inversify';

@injectable()
export class ConsoleLogger implements ILogger {
  public debug(message: string, ...args: unknown[]): void {
    console.debug(message, ...args);
  }

  public error(message: string, error: Error, ...args: unknown[]): void {
    console.error(message, ...args);
    logError(error);
  }

  public info(message: string, ...args: unknown[]): void {
    logInfo(message, args);
  }

  public warn(message: string, ...args: unknown[]): void {
    console.warn(message, ...args);
  }
}
