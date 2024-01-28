import { IConfig } from './config.interface.js';
import { config } from 'dotenv';
import { Logger} from '../logger/index.js';
import { configRestSchema, ApplicationSchema } from './schema.js';
import { inject, injectable } from 'inversify';
import { Components } from '../../types/index.js';

@injectable()
export class Config implements IConfig<ApplicationSchema> {
  private readonly config: ApplicationSchema;

  constructor(
    @inject(Components.Logger) private readonly logger: Logger) {
    const { error, parsed } = config();

    if (error) {
      throw Error('Cannot find or read .env file!');
    }

    configRestSchema.load(parsed);
    configRestSchema.validate({ allowed: 'strict', output: this.logger.info });

    this.config = configRestSchema.getProperties();
    this.logger.info('.env file found and successfully parsed!');
  }

  public get<T extends keyof ApplicationSchema>(key: T): ApplicationSchema[T] {
    return this.config[key];
  }
}
