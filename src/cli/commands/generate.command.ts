import axios from 'axios';
import { Command } from './command.interface.js';
import { Commands } from './commands.enums.js';
import { Components, MockedOffers } from '../../shared/types/index.js';
import { TsvOfferGenerator } from '../../shared/libs/offers-generator/index.js';
import { TSVFileWriter } from '../../shared/libs/file-writer/index.js';
import { inject, injectable } from 'inversify';
import { ILogger } from '../../shared/libs/logger/index.js';
import { PRICE_RADIX } from '../../shared/utils/index.js';

@injectable()
export class GenerateCommand implements Command {
  constructor(
    @inject(Components.ConsoleLogger) private readonly logger: ILogger
  ) {}

  private mockedOffers: MockedOffers | undefined = undefined;

  private async fetch(url: string): Promise<void> {
    try {
      this.mockedOffers = (await axios.get(url)).data;
    } catch {
      throw new Error(`Can't retrieve data from ${url}`);
    }
  }

  private async write(filepath: string, offersCount: number) {
    if (this.mockedOffers) {
      const tsvOfferGenerator = new TsvOfferGenerator(this.mockedOffers);
      const tsvFileWriter = new TSVFileWriter(filepath);

      const promises = new Array(offersCount).fill(null).map(
        () => tsvFileWriter.write(tsvOfferGenerator.generate()
        ));
      await Promise.all(promises);
    } else {
      throw Error('MockedOffers data has not been retried!');
    }
  }

  public getName(): string {
    return Commands.generate;
  }

  public async execute(...parameters: string[]): Promise<void> {
    const [count, filepath, url] = parameters;
    if (!count || !filepath || !url) {
      throw Error('Arguments have not been passed!');
    } else {
      const offersCount = Number.parseInt(count, PRICE_RADIX);
      try {
        await this.fetch(url);
        await this.write(filepath, offersCount);
        this.logger.info(`💪 File ${filepath} was created!`);
      } catch (error: unknown) {
        this.logger.error('Can\'t generate data', error as Error);
      }
    }
  }
}
