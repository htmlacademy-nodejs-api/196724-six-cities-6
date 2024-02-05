import { IApplication } from './application.interface.js';
import { ILogger } from '../shared/libs/logger/index.js';
import { ApplicationSchema, IConfig } from '../shared/libs/config/index.js';
import { inject, injectable } from 'inversify';
import { Components } from '../shared/types/index.js';
import { IDatabaseClient } from '../shared/libs/database-client/index.js';
import { getMongoUrl } from '../shared/utils/database.js';


@injectable()
export class Application implements IApplication {
  constructor(
    @inject(Components.Logger) private readonly logger: ILogger,
    @inject(Components.Config) private readonly config: IConfig<ApplicationSchema>,
    @inject(Components.DatabaseClient) private readonly databaseClient: IDatabaseClient,
  ) {
  }

  private initializeDataBase() {
    const url = getMongoUrl({
      username: this.config.get('DB_USER'),
      password: this.config.get('DB_PASSWORD'),
      host: this.config.get('DB_HOST'),
      port: this.config.get('DB_PORT'),
      databaseName: this.config.get('DB_NAME')
    });
    return this.databaseClient.connect(url);
  }

  public async init() {
    this.logger.info('Init');
    this.logger.info(`Get value from env $PORT: ${this.config.get('PORT')}`);

    this.logger.info('Init database connection ...');
    await this.initializeDataBase();
    this.logger.info('Init database completed');
  }
}
