import * as Mongoose from 'mongoose';
import { inject, injectable } from 'inversify';
import { IDatabaseClient } from './database-client.interface.js';
import { Components } from '../../types/index.js';
import { ILogger } from '../logger/index.js';
import { retryConnection } from '../../utils/index.js';

const MAX_CONNECTING: number = 1;
const MAX_CONNECTING_TRIES: number = 3;
const CONNECTED_STATE: number = 1;

@injectable()
export class DatabaseClient implements IDatabaseClient {
  private mongoose: typeof Mongoose;

  constructor(
    @inject(Components.Logger) private readonly logger: ILogger
  ) {}

  get isConnectedDatabase() {
    return this.mongoose?.connection?.readyState === CONNECTED_STATE;
  }

  public async connect(url: string): Promise<void> {
    if (!this.isConnectedDatabase) {
      return retryConnection({
        callback: async () => {
          this.logger.info('Progressing MongoDB connection ...');
          this.mongoose = await Mongoose.connect(
            url, { maxConnecting: MAX_CONNECTING }
          );
          this.logger.info('Database connection established.');
        },
        onFailed: () => {
          this.logger.warn('Failed to connect to the database.');
        },
        tries: MAX_CONNECTING_TRIES});
    }
    throw new Error('MongoDB client already connected');
  }

  public async disconnect(): Promise<void> {
    if (this.mongoose && this.isConnectedDatabase) {
      this.mongoose.disconnect?.();
      this.logger.info('Database connection closed.');
    } else {
      throw new Error('Not connected to the database.');
    }
  }
}
