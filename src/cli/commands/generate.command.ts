import axios from 'axios';
import { Command } from './command.interface.js';
import { Commands } from './commands.enums.js';
import { MockedOffers } from '../../shared/types/index.js';
import { TsvOfferGenerator } from '../../shared/libs/offers-generator/index.js';
import {logError, logInfo} from '../../shared/utils/index.js';
import { TSVFileWriter } from '../../shared/libs/file-writer/index.js';

export class GenerateCommand implements Command {
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
      const offersCount = Number.parseInt(count, 10);
      try {
        await this.fetch(url);
        await this.write(filepath, offersCount);
        logInfo(`💪 File ${filepath} was created!`);
      } catch (error: unknown) {
        logError('Can\'t generate data');
        logError(error);
      }
    }
  }
}
