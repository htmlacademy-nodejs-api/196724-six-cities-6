import { Command } from './command.interface.js';
import { TSVFileReader } from '../../shared/libs/file-reader/index.js';
import { logError, mapToOffer } from '../../shared/utils/index.js';
import { Commands } from './commands.enums.js';
import { Events, Offer } from '../../shared/types/index.js';

export class ImportCommand implements Command {
  private offers: Offer[] = [];
  public getName(): string {
    return Commands.import;
  }

  private onImportedLine = (line: string) => {
    const offer = mapToOffer(line);
    this.offers.push(offer);
  };

  private onCompleteImport = () => {
    console.info(this.offers);
    console.info(`${this.offers.length} rows imported.`);
  };

  public async execute(...parameters: string[]): Promise<void> {
    const [filename] = parameters;
    if (!filename) {
      throw Error('Filename have not been passed!');
    } else {
      const fileReader = new TSVFileReader(filename.trim());

      fileReader.on(Events.line, this.onImportedLine);
      fileReader.on(Events.end, this.onCompleteImport);

      try {
        await fileReader.read();
      } catch (error) {
        console.error(`Can't import data from file: ${filename}`);
        console.error(logError(error));
      }
    }
  }
}
