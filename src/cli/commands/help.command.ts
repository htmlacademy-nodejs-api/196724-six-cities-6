import { Command } from './command.interface.js';
import { Commands } from './commands.enums.js';
import Chalk from 'chalk';

export class HelpCommand implements Command {
  public getName(): string {
    return Commands.help;
  }

  public async execute(..._parameters: string[]): Promise<void> {
    console.info(`
      ${Chalk.green('Программа для подготовки данных для REST API сервера.')}
      ${Chalk.blue('Пример:')} cli.js --<command> [--arguments]
      ${Chalk.blue('Команды:')}
        --version:                   ✓ выводит номер версии
        --help:                      ✓ печатает этот текст
        --import <path>:             ✓ импортирует данные из TSV
    `);
  }
}
