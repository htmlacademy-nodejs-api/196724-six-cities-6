import { WriteStream } from 'node:fs';
import { createWriteStream } from 'node:fs';
import { FileWriter } from './file-writer.interface.js';
import { Events } from '../../types/index.js';

export class TSVFileWriter implements FileWriter {
  private stream: WriteStream;

  constructor(filename: string) {
    this.stream = createWriteStream(filename, {
      flags: 'w',
      encoding: 'utf-8',
      autoClose: true,
    });
  }

  public async write(rowData: string): Promise<unknown> {
    const writeSuccess: boolean = this.stream.write(`${rowData}\n`);
    if (!writeSuccess) {
      return new Promise((resolve) => {
        this.stream.once(Events.drain, () => resolve(true));
      });
    }

    return Promise.resolve();
  }
}
