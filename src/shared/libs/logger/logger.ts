import { ILogger } from './logger.interface.js';
import { Logger as PinoLogger, pino } from 'pino';
import { injectable } from 'inversify';

@injectable()
export class Logger implements ILogger {
  private readonly logger: PinoLogger = pino();

  constructor() {
    this.logger.info('Logger initialized');
  }

  public info(message: string, ...args: unknown[]): void {
    this.logger.info(message, ...args);
  }

  public warn(message: string, ...args: unknown[]): void {
    this.logger.warn(message, ...args);
  }

  public debug(message: string, ...args: unknown[]): void {
    this.logger.debug(message, ...args);
  }

  public error(message: string, error: Error, ...args: unknown[]): void {
    this.logger.error(error, message, ...args);
  }
}
