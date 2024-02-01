import 'reflect-metadata';
import { Container } from 'inversify';
import { IInversifyContainer } from './inversify-container.interface.js';
import { Application, IApplication } from '../../../application/index.js';
import { Components } from '../../types/index.js';
import { ILogger, Logger } from '../logger/index.js';
import { ApplicationSchema, Config, IConfig } from '../config/index.js';

export class InversifyContainer extends Container implements IInversifyContainer{
  public initMainApplicationContainers() {
    this.bind<IApplication>(Components.Application).to(Application).inSingletonScope();
    this.bind<ILogger>(Components.Logger).to(Logger).inSingletonScope();
    this.bind<IConfig<ApplicationSchema>>(Components.Config).to(Config).inSingletonScope();
  }

  public get application() {
    if (this.isBound(Components.Application)) {
      return this.get<IApplication>(Components.Application);
    }
    throw Error('Application container has not been bound!');
  }
}
