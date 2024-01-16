import { Command } from './command.interface.js';
import { Commands } from './commands.enums.js';
import { TSVFileReader } from '../../shared/libs/file-reader/index.js';

export class ImportCommand implements Command {
  public getName(): string {
    return Commands.import;
  }

  public execute(...parameters: string[]): void {
    const [filename] = parameters;
    if (filename) {
      const fileReader = new TSVFileReader(filename.trim());

      try {
        fileReader.read();
        console.log(fileReader.mapToOffers());
      } catch (err) {

        if (!(err instanceof Error)) {
          throw err;
        }

        console.error(`Can't import data from file: ${filename}.`);
        console.error(`Details: ${err.message}.`);
      }
    } else {
      console.error('Required filename parameter has not been specified.');
    }
  }
}
