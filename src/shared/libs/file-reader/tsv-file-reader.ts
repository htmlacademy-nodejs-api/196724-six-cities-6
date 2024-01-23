import { FileReader } from './file-reader.interface.js';
import { createReadStream } from 'node:fs';
import EventEmitter from 'node:events';
import { Events } from '../../types/index.js';

const MIN_CHUNK_SIZE = 384;
export class TSVFileReader extends EventEmitter implements FileReader {
  constructor(
    private readonly filename: string
  ) {
    super();
  }

  public async read(): Promise<void> {
    const readStream = createReadStream(this.filename, {
      highWaterMark: MIN_CHUNK_SIZE,
      encoding: 'utf-8',
    });

    let remainingData = '';
    let nextLinePosition = -1;

    for await (const chunk of readStream) {
      remainingData += chunk.toString();
      while ((nextLinePosition = remainingData.indexOf('\n')) >= 0) {
        const completeRow = remainingData.slice(0, nextLinePosition + 1);
        remainingData = remainingData.slice(++nextLinePosition);
        this.emit(Events.line, completeRow);
      }
    }
    this.emit(Events.end);
  }
}
