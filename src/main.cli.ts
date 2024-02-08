#!/usr/bin/env node
import { InversifyContainer } from './shared/libs/inversify-container/index.js';

const container = new InversifyContainer();
function bootstrap() {
  container.initCliApplication();
  container.cliApplication.registerCommands();
  container.cliApplication.processCommand(process.argv);
}

bootstrap();
