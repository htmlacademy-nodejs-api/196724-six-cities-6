import { Container } from 'inversify';
import { IApplication } from './application.interface.js';
import { Components } from '../shared/types/index.js';
import { Application } from './application.js';
import { ApplicationSchema, Config, IConfig } from '../shared/libs/config/index.js';
import { DatabaseClient, IDatabaseClient } from '../shared/libs/database-client/index.js';
import { ILogger, Logger } from '../shared/libs/logger/index.js';
import {
  AppExceptionFilter,
  HttpErrorExceptionFilter,
  IExceptionFilter,
  ValidationExceptionFilter,
  AuthExceptionFilter
} from '../shared/libs/exeption-filter/index.js';
import {StoragePathTransformer} from '../shared/libs/transformer/index.js';

export function createApplicationContainer() {
  const applicationContainer: Container = new Container();

  applicationContainer.bind<IApplication>(Components.Application).to(Application).inSingletonScope();
  applicationContainer.bind<ILogger>(Components.Logger).to(Logger).inSingletonScope();
  applicationContainer.bind<IConfig<ApplicationSchema>>(Components.Config).to(Config).inSingletonScope();
  applicationContainer.bind<IDatabaseClient>(Components.DatabaseClient).to(DatabaseClient).inSingletonScope();
  applicationContainer.bind<IExceptionFilter>(Components.AppExceptionFilter).to(AppExceptionFilter).inSingletonScope();
  applicationContainer.bind<IExceptionFilter>(Components.HttpExceptionFilter).to(HttpErrorExceptionFilter).inSingletonScope();
  applicationContainer.bind<IExceptionFilter>(Components.ValidationExceptionFilter).to(ValidationExceptionFilter).inSingletonScope();
  applicationContainer.bind<IExceptionFilter>(Components.AuthExceptionFilter).to(AuthExceptionFilter).inSingletonScope();
  applicationContainer.bind<StoragePathTransformer>(Components.StoragePathTransformer).to(StoragePathTransformer).inSingletonScope();
  return applicationContainer;
}
