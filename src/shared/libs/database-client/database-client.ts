import * as Mongoose from 'mongoose';
import { inject, injectable } from 'inversify';
import { IDatabaseClient } from './database-client.interface.js';
import { Components } from '../../types/index.js';
import { ILogger } from '../logger/index.js';

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

  private retryConnection = async (callback: () => Promise<void>, tries: number): Promise<void> => {
    try {
      return await callback();
    } catch (error) {
      if (tries > 1) {
        this.logger.warn(`Failed to connect to the database. Attempt ${MAX_CONNECTING_TRIES - (tries - 2)}`);
        return await this.retryConnection(callback, tries - 1);
      } else {
        throw error;
      }
    }
  };

  public async connect(url: string): Promise<void> {
    if (!this.isConnectedDatabase) {
      return this.retryConnection(async () => {
        this.logger.info('Progressing MongoDB connection ...');
        this.mongoose = await Mongoose.connect(
          url, { maxConnecting: MAX_CONNECTING }
        );
        this.logger.info('Database connection established.');
      }, MAX_CONNECTING_TRIES);

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
