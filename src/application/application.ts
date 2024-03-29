import { IApplication } from './application.interface.js';
import { ILogger } from '../shared/libs/logger/index.js';
import { ApplicationSchema, IConfig } from '../shared/libs/config/index.js';
import { inject, injectable } from 'inversify';
import { IDatabaseClient } from '../shared/libs/database-client/index.js';
import { getMongoUrl } from '../shared/utils/database.js';
import express, {Express} from 'express';
import { ApplicationRoutes, IController } from '../shared/libs/controller/index.js';
import {Components, Storage} from '../shared/types/index.js';
import { IExceptionFilter } from '../shared/libs/exeption-filter/index.js';
import { IMiddleware, ParseTokenMiddleware } from '../shared/libs/middleware/index.js';
import cors from 'cors';
@injectable()
export class Application implements IApplication {
  private readonly server: Express;
  constructor(
    @inject(Components.Logger) private readonly logger: ILogger,
    @inject(Components.Config) private readonly config: IConfig<ApplicationSchema>,
    @inject(Components.DatabaseClient) private readonly databaseClient: IDatabaseClient,
    @inject(Components.UserController) private readonly userController: IController,
    @inject(Components.OfferController) private readonly offerController: IController,
    @inject(Components.CommentController) private readonly commentController: IController,
    @inject(Components.AppExceptionFilter) private readonly appExceptionFilter: IExceptionFilter,
    @inject(Components.HttpExceptionFilter) private readonly httpExceptionFilter: IExceptionFilter,
    @inject(Components.ValidationExceptionFilter) private readonly validationExceptionFilter: IExceptionFilter,
    @inject(Components.AuthExceptionFilter) private readonly authExceptionFilter: IExceptionFilter,
  ) {
    this.server = express();
  }

  private initializeDatabase() {
    const url = getMongoUrl({
      username: this.config.get('DB_USER'),
      password: this.config.get('DB_PASSWORD'),
      host: this.config.get('DB_HOST'),
      port: this.config.get('DB_PORT'),
      databaseName: this.config.get('DB_NAME')
    });
    return this.databaseClient.connect(url);
  }

  private async initializeServer() {
    const port = this.config.get('PORT');
    const host = this.config.get('HOST');
    this.server.listen(port,host);
  }

  private async initializeMiddleware() {
    const authenticateMiddleware: IMiddleware = new ParseTokenMiddleware(this.config.get('JWT_SECRET'));
    this.server.use(express.json());
    this.server.use(
      Storage.upload,
      express.static(this.config.get('UPLOAD_DIRECTORY'))
    );
    this.server.use(
      Storage.static,
      express.static(this.config.get('STATIC_DIRECTORY'))
    );
    this.server.use(authenticateMiddleware.execute.bind(authenticateMiddleware));
    this.server.use(cors());
  }

  private async initializeControllers() {
    this.server.use(ApplicationRoutes.users, this.userController.router);
    this.server.use(ApplicationRoutes.offers, this.offerController.router);
    this.server.use(ApplicationRoutes.comments, this.commentController.router);
  }

  private async initializeExceptionFilters() {
    this.server.use(this.authExceptionFilter.catch.bind(this.authExceptionFilter));
    this.server.use(this.validationExceptionFilter.catch.bind(this.validationExceptionFilter));
    this.server.use(this.httpExceptionFilter.catch.bind(this.httpExceptionFilter));
    this.server.use(this.appExceptionFilter.catch.bind(this.appExceptionFilter));
  }

  public async init() {
    this.logger.info('Init application ...');

    this.logger.info('Init database connection ...');
    await this.initializeDatabase();
    this.logger.info('Init database completed!');

    this.logger.info('Init app-level middleware ...');
    await this.initializeMiddleware();
    this.logger.info('App-level middleware initialization completed!');

    this.logger.info('Init controllers ...');
    await this.initializeControllers();
    this.logger.info('Controller initialization completed!');


    this.logger.info('Init exception filters ...');
    await this.initializeExceptionFilters();
    this.logger.info('Exception filters initialization completed!');

    this.logger.info('Try to init serve ...');
    await this.initializeServer();
    this.logger.info(`Server started on http://localhost:${this.config.get('PORT')}`);
  }
}
