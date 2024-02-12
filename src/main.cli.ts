#!/usr/bin/env node
import 'reflect-metadata';
import { createCliApplicationContainer, ICliApplication } from './cli/index.js';
import { Components } from './shared/types/index.js';

function bootstrap() {
  const cliApplicationContainer = createCliApplicationContainer();
  const cliApplication = cliApplicationContainer.get<ICliApplication>(Components.CliApplication);
  cliApplication.registerCommands();
  cliApplication.processCommand(process.argv);
}

bootstrap();
