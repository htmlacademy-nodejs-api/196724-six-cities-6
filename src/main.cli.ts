#!/usr/bin/env node
import {CliApplication, HelpCommand} from './cli/index.js';

function bootstrap() {
  const cliApplication = new CliApplication();
  cliApplication.registerCommands([
    new HelpCommand(),
  ]);

  cliApplication.processCommand(process.argv);
}

bootstrap();
