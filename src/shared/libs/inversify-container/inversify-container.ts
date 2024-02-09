import 'reflect-metadata';
import { Container } from 'inversify';
import { IInversifyContainer } from './inversify-container.interface.js';
import { Application, IApplication } from '../../../application/index.js';
import { Components } from '../../types/index.js';
import { ILogger, Logger, ConsoleLogger } from '../logger/index.js';
import { ApplicationSchema, Config, IConfig } from '../config/index.js';
import { DatabaseClient, IDatabaseClient } from '../database-client/index.js';
import { IUserService, UserEntity, UserModel, UserService } from '../../modules/user/index.js';
import { types } from '@typegoose/typegoose';
import { IOfferService, OfferEntity, OfferModel, OfferService } from '../../modules/offer/index.js';
import {
  CliApplication,
  Command,
  GenerateCommand,
  HelpCommand,
  ICliApplication,
  ImportCommand,
  VersionCommand
} from '../../../cli/index.js';
import { ICommentService, CommentService, CommentEntity, CommentModel } from '../../modules/comment/index.js';

export class InversifyContainer extends Container implements IInversifyContainer {
  public initMainApplication() {
    this.bind<IApplication>(Components.Application).to(Application).inSingletonScope();
    this.bind<ILogger>(Components.Logger).to(Logger).inSingletonScope();
    this.bind<IConfig<ApplicationSchema>>(Components.Config).to(Config).inSingletonScope();
    this.initDataBaseEntities();
  }

  private initDataBaseEntities() {
    this.bind<IDatabaseClient>(Components.DatabaseClient).to(DatabaseClient).inSingletonScope();
    this.bind<IUserService>(Components.UserService).to(UserService).inSingletonScope();
    this.bind<types.ModelType<UserEntity>>(Components.UserModel).toConstantValue(UserModel);
    this.bind<IOfferService>(Components.OfferService).to(OfferService).inSingletonScope();
    this.bind<types.ModelType<OfferEntity>>(Components.OfferModel).toConstantValue(OfferModel);
    this.bind<ICommentService>(Components.CommentService).to(CommentService).inSingletonScope();
    this.bind<types.ModelType<CommentEntity>>(Components.CommentModel).toConstantValue(CommentModel);
  }

  private initCliCommands() {
    this.bind<Command>(Components.HelpCommand).to(HelpCommand).inSingletonScope();
    this.bind<Command>(Components.ImportCommand).to(ImportCommand).inSingletonScope();
    this.bind<Command>(Components.VersionCommand).to(VersionCommand).inSingletonScope();
    this.bind<Command>(Components.GenerateCommand).to(GenerateCommand).inSingletonScope();
  }

  public initCliApplication() {
    this.bind<ICliApplication>(Components.CliApplication).to(CliApplication).inSingletonScope();
    this.bind<ILogger>(Components.ConsoleLogger).to(ConsoleLogger).inSingletonScope();
    this.initCliCommands();
    this.initDataBaseEntities();
  }

  public get application() {
    if (this.isBound(Components.Application)) {
      return this.get<IApplication>(Components.Application);
    }
    throw Error('Application container has not been bound!');
  }

  public get cliApplication() {
    if (this.isBound(Components.CliApplication)) {
      return this.get<ICliApplication>(Components.CliApplication);
    }
    throw Error('CliApplication container has not been bound!');
  }
}
