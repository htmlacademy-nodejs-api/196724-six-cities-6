import { IApplication } from './application.interface.js';
import { ILogger } from '../shared/libs/logger/index.js';
import { ApplicationSchema, IConfig } from '../shared/libs/config/index.js';
import { inject, injectable } from 'inversify';
import { Components } from '../shared/types/index.js';


@injectable()
export class Application implements IApplication {
  constructor(
    @inject(Components.Logger) private readonly logger: ILogger,
    @inject(Components.Config) private readonly config: IConfig<ApplicationSchema>
  ) {
  }

  public async init() {
    this.logger.info('Init');
    this.logger.info(`Get value from env $PORT: ${this.config.get('PORT')}`);
  }
}
