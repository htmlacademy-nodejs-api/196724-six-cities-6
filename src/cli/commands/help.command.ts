import { Command } from './command.interface.js';
import { Commands } from './commands.enums.js';
import Chalk from 'chalk';
import { inject, injectable } from 'inversify';
import { Components } from '../../shared/types/index.js';
import { ILogger } from '../../shared/libs/logger/index.js';

@injectable()
export class HelpCommand implements Command {
  constructor(
    @inject(Components.ConsoleLogger) private readonly logger: ILogger
  ) {}

  public getName(): string {
    return Commands.help;
  }

  public async execute(..._parameters: string[]): Promise<void> {
    this.logger.info(`
      ${Chalk.green('Программа для подготовки данных для REST API сервера.')}
      ${Chalk.blue('Пример:')} cli.js --<command> [--arguments]
      ${Chalk.blue('Команды:')}
        --version:                                                 ✓ shows the current project version
        --help:                                                    ✓ shows instruction in terminal
        --import <path> <user> <password> <host> <port> <dbName>:  ✓ imports data from generated TSV file into MongoDB
        --generate <count> <path> <url>:                           ✓ generates random offers data and write TSV file to /mocks
    `);
  }
}
