import { Container } from 'inversify';
import { IApplication } from './application.interface.js';
import { Components } from '../shared/types/index.js';
import { Application } from './application.js';
import { ApplicationSchema, Config, IConfig } from '../shared/libs/config/index.js';
import { DatabaseClient, IDatabaseClient } from '../shared/libs/database-client/index.js';
import { ILogger, Logger } from '../shared/libs/logger/index.js';
import { IController} from '../shared/libs/controller/index.js';
import { UserController} from '../shared/modules/user/index.js';
import { OfferController} from '../shared/modules/offer/index.js';
import { ExceptionFilter, IExceptionFilter } from '../shared/libs/exeption-filter/index.js';

export function createApplicationContainer() {
  const applicationContainer: Container = new Container();

  applicationContainer.bind<IApplication>(Components.Application).to(Application).inSingletonScope();
  applicationContainer.bind<ILogger>(Components.Logger).to(Logger).inSingletonScope();
  applicationContainer.bind<IConfig<ApplicationSchema>>(Components.Config).to(Config).inSingletonScope();
  applicationContainer.bind<IDatabaseClient>(Components.DatabaseClient).to(DatabaseClient).inSingletonScope();
  applicationContainer.bind<IController>(Components.UserController).to(UserController).inSingletonScope();
  applicationContainer.bind<IController>(Components.OfferController).to(OfferController).inSingletonScope();
  applicationContainer.bind<IExceptionFilter>(Components.ExceptionFilter).to(ExceptionFilter).inSingletonScope();

  return applicationContainer;
}
