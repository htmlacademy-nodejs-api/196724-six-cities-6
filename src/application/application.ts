import { IApplication } from './application.interface.js';
import { ILogger } from '../shared/libs/logger/index.js';
import { ApplicationSchema, IConfig } from '../shared/libs/config/index.js';
import { inject, injectable } from 'inversify';
import { Components } from '../shared/types/index.js';
import { IDatabaseClient } from '../shared/libs/database-client/index.js';
import { getMongoUrl } from '../shared/utils/database.js';
import express, {Express} from 'express';

@injectable()
export class Application implements IApplication {
  private readonly server: Express;
  constructor(
    @inject(Components.Logger) private readonly logger: ILogger,
    @inject(Components.Config) private readonly config: IConfig<ApplicationSchema>,
    @inject(Components.DatabaseClient) private readonly databaseClient: IDatabaseClient,
  ) {
    this.server = express();
  }

  private initializeDatabase() {
    const url = getMongoUrl({
      username: this.config.get('DB_USER'),
      password: this.config.get('DB_PASSWORD'),
      host: this.config.get('DB_HOST'),
      port: this.config.get('DB_PORT'),
      databaseName: this.config.get('DB_NAME')
    });
    return this.databaseClient.connect(url);
  }

  private async initializeServer() {
    const port = this.config.get('PORT');
    this.server.listen(port);
  }

  private async initializeMiddleware() {
    this.server.use(express.json());
  }

  public async init() {
    this.logger.info('Init application ...');

    this.logger.info('Init database connection ...');
    await this.initializeDatabase();
    this.logger.info('Init database completed!');

    this.logger.info('Init app-level middleware ...');
    await this.initializeMiddleware();
    this.logger.info('App-level middleware initialization completed!');

    this.logger.info('Try to init serve ...');
    await this.initializeServer();
    this.logger.info(`Server started on http://localhost:${this.config.get('PORT')}`);
  }
}
