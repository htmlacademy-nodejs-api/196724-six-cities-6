import 'reflect-metadata';
import { Application, IApplication } from './application/index.js';
import { ILogger, Logger } from './shared/libs/logger/index.js';
import { Config, ApplicationSchema, IConfig } from './shared/libs/config/index.js';
import { Container } from 'inversify';
import { Components } from './shared/types/index.js';

const bootstrap = () => {
  const container = new Container();
  container.bind<IApplication>(Components.Application).to(Application).inSingletonScope();
  container.bind<ILogger>(Components.Logger).to(Logger).inSingletonScope();
  container.bind<IConfig<ApplicationSchema>>(Components.Config).to(Config).inSingletonScope();

  const application = container.get<IApplication>(Components.Application);
  application.init();
};

bootstrap();
