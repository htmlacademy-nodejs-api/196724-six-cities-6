import { Command } from './command.interface.js';
import { TSVFileReader } from '../../shared/libs/file-reader/index.js';
import { getMongoUrl, mapToOffer } from '../../shared/utils/index.js';
import { Commands } from './commands.enums.js';
import { Components, Events, Offer } from '../../shared/types/index.js';
import { inject, injectable } from 'inversify';
import { ILogger } from '../../shared/libs/logger/index.js';
import { ApplicationSchema, IConfig } from '../../shared/libs/config/index.js';
import { IDatabaseClient } from '../../shared/libs/database-client/index.js';
import { IUserService } from '../../shared/modules/user/index.js';
import { IOfferService } from '../../shared/modules/offer/index.js';

@injectable()
export class ImportCommand implements Command {
  constructor(
    @inject(Components.ConsoleLogger) private readonly logger: ILogger,
    @inject(Components.Config) private readonly config: IConfig<ApplicationSchema>,
    @inject(Components.DatabaseClient) private readonly databaseClient: IDatabaseClient,
    @inject(Components.UserService) private readonly userService: IUserService,
    @inject(Components.OfferService) private readonly offerService: IOfferService
  ) {}

  private offersCount: number = 0;
  public getName(): string {
    return Commands.import;
  }

  private onImportedLine = async (line: string, resolve: () => void): Promise<void> => {
    const offer = mapToOffer(line);
    await this.saveOffer(offer);
    resolve();
  };

  private onCompleteImport = async (): Promise<void> => {
    this.logger.info(`${this.offersCount} rows imported.`);
    await this.databaseClient.disconnect();
  };

  private async saveOffer(offer: Offer) {
    const user = await this.userService.findById(offer.userId);

    if (user) {
      try {
        await this.offerService.create(offer);
        this.offersCount += 1;
      } catch (error) {
        this.logger.error('Can not create an offer', error as Error);
      }

    }
  }

  public async execute(...parameters: string[]): Promise<void> {
    const [filename] = parameters;
    if (!filename) {
      throw Error('Filename have not been passed!');
    } else {

      const url = getMongoUrl({
        username: this.config.get('DB_USER'),
        password: this.config.get('DB_PASSWORD'),
        host: this.config.get('DB_HOST'),
        port: this.config.get('DB_PORT'),
        databaseName: this.config.get('DB_NAME')
      });
      await this.databaseClient.connect(url);

      const fileReader = new TSVFileReader(filename.trim());

      fileReader.on(Events.line, this.onImportedLine);
      fileReader.on(Events.end, this.onCompleteImport);

      try {
        await fileReader.read();
      } catch (error) {
        this.logger.error(`Can't import data from file: ${filename}`, error as Error);
      }
    }
  }
}
