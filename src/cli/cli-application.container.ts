import { Container } from 'inversify';
import { Components } from '../shared/types/index.js';
import { ConsoleLogger, ILogger } from '../shared/libs/logger/index.js';
import { CliApplication } from './cli-application.js';
import { Command } from './commands/command.interface.js';
import { HelpCommand } from './commands/help.command.js';
import { ImportCommand } from './commands/import.command.js';
import { VersionCommand } from './commands/version.command.js';
import { GenerateCommand } from './commands/generate.command.js';
import { ICliApplication } from './cli-application.interface.js';

export function createCliApplicationContainer() {
  const cliApplicationContainer: Container = new Container();

  cliApplicationContainer.bind<ICliApplication>(Components.CliApplication).to(CliApplication).inSingletonScope();
  cliApplicationContainer.bind<ILogger>(Components.ConsoleLogger).to(ConsoleLogger).inSingletonScope();

  cliApplicationContainer.bind<Command>(Components.HelpCommand).to(HelpCommand).inSingletonScope();
  cliApplicationContainer.bind<Command>(Components.ImportCommand).to(ImportCommand).inSingletonScope();
  cliApplicationContainer.bind<Command>(Components.VersionCommand).to(VersionCommand).inSingletonScope();
  cliApplicationContainer.bind<Command>(Components.GenerateCommand).to(GenerateCommand).inSingletonScope();

  return cliApplicationContainer;
}
