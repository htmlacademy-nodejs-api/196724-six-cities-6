import { Command } from './command.interface.js';
import { TSVFileReader } from '../../shared/libs/file-reader/index.js';
import { getMongoUrl, mapToOffer } from '../../shared/utils/index.js';
import { Commands } from './commands.enums.js';
import { Events, Offer } from '../../shared/types/index.js';
import { injectable } from 'inversify';
import { DatabaseClient } from '../../shared/libs/database-client/index.js';
import { UserModel, UserService} from '../../shared/modules/user/index.js';
import { OfferModel, OfferService} from '../../shared/modules/offer/index.js';
import { ConsoleLogger } from '../../shared/libs/logger/console.logger.js';
import { Logger} from '../../shared/libs/logger/index.js';

@injectable()
export class ImportCommand implements Command {
  private offersCount: number = 0;

  private consoleLogger: ConsoleLogger = new ConsoleLogger();
  private logger: ConsoleLogger = new Logger();
  private userService: UserService = new UserService(UserModel, this.logger);
  private offerService: OfferService = new OfferService(OfferModel, this.logger);
  private databaseClient: DatabaseClient = new DatabaseClient(this.logger);


  public getName(): string {
    return Commands.import;
  }

  private onImportedLine = async (line: string, resolve: () => void): Promise<void> => {
    const offer = mapToOffer(line);
    await this.saveOffer(offer);
    resolve();
  };

  private onCompleteImport = async (): Promise<void> => {
    this.consoleLogger.info(`${this.offersCount} rows imported.`);
    await this.databaseClient.disconnect();
  };

  private async saveOffer(offer: Offer) {
    const user = await this.userService.findById(offer.userId);

    if (user) {
      try {
        await this.offerService.create(offer);
        this.offersCount += 1;
      } catch (error) {
        this.consoleLogger.error('Can not create an offer', error as Error);
      }

    }
  }

  public async execute(...parameters: string[]): Promise<void> {
    const [filename, username, password, host, port, databaseName] = parameters;
    if (!filename || !username || !password || !host || !port || !databaseName) {
      throw Error('One of required arguments has not been passed! Please run --help command for instructions.');
    } else {

      const url = getMongoUrl({
        username,
        password,
        host,
        port,
        databaseName
      });
      await this.databaseClient.connect(url);

      const fileReader = new TSVFileReader(filename.trim());

      fileReader.on(Events.line, this.onImportedLine);
      fileReader.on(Events.end, this.onCompleteImport);

      try {
        await fileReader.read();
      } catch (error) {
        this.consoleLogger.error(`Can't import data from file: ${filename}`, error as Error);
      }
    }
  }
}
