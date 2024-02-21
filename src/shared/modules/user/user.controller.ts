import { Controller, HttpMethod } from '../../libs/controller/index.js';
import { inject, injectable } from 'inversify';
import {Components, Storages} from '../../types/index.js';
import { ILogger } from '../../libs/logger/index.js';
import { IUserService } from './user-service.interface.js';
import { Response} from 'express';
import { fillDto } from '../../utils/index.js';
import { UserRdo } from './rdos/index.js';
import {
  AddUserFavouriteOfferRequest,
  CreateUserRequest,
  GetUserRequest,
  LoginUserRequest,
  RemoveUserFavouriteOfferRequest, UploadUserAvatarRequest
} from './types/index.js';
import { HttpError } from '../../libs/exeption-filter/index.js';
import { StatusCodes } from 'http-status-codes';
import { IOfferService } from '../offer/index.js';
import {
  DocumentExistsMiddleware,
  IMiddleware,
  UploadFileMiddleware,
  ValidateDtoMiddleware,
  ValidateObjectIdMiddleware
} from '../../libs/middleware/index.js';
import { CreateUserDto, LoginUserDto } from './dtos/index.js';
import { userAddFavouriteOfferValidator, userCreateValidator, userLoginValidator } from './validators/index.js';
import { AddUserFavouriteOfferDto } from './dtos/index.js';
import { ApplicationSchema, IConfig } from '../../libs/config/index.js';

@injectable()
export class UserController extends Controller {
  private readonly validateObjectIdMiddleware: IMiddleware;

  constructor(
    @inject(Components.Logger) protected readonly logger: ILogger,
    @inject(Components.UserService) private readonly userService: IUserService,
    @inject(Components.OfferService) private readonly offerService: IOfferService,
    @inject(Components.Config) private readonly config: IConfig<ApplicationSchema>,
  ) {
    super(logger);
    this.logger.info('Register routes for UserController ...');

    this.validateObjectIdMiddleware = new ValidateObjectIdMiddleware(['id', 'offerId']);

    this.addRoute({
      path: '/create',
      method: HttpMethod.Post,
      handler: this.create,
      middleware: [new ValidateDtoMiddleware(CreateUserDto, userCreateValidator)]
    });

    this.addRoute({
      path: '/login',
      method: HttpMethod.Post,
      handler: this.login,
      middleware: [new ValidateDtoMiddleware(LoginUserDto, userLoginValidator)]

    });

    this.addRoute({
      path: '/:id/offers/favourite/add',
      method: HttpMethod.Post,
      handler: this.addFavouriteOffer,
      middleware: [this.validateObjectIdMiddleware, new ValidateDtoMiddleware(AddUserFavouriteOfferDto, userAddFavouriteOfferValidator)]
    });

    this.addRoute({
      path: '/:id',
      method: HttpMethod.Get,
      handler: this.getById,
      middleware: [this.validateObjectIdMiddleware]
    });

    this.addRoute({
      path: '/:id/offers/favourite/:offerId/remove',
      method: HttpMethod.Delete,
      handler: this.removeFavouriteOffer,
      middleware: [this.validateObjectIdMiddleware]
    });

    this.addRoute({
      path: '/:id/avatar',
      method: HttpMethod.Post,
      handler: this.uploadAvatar,
      middleware: [
        this.validateObjectIdMiddleware,
        new DocumentExistsMiddleware(this.userService, 'User', 'id'),
        new UploadFileMiddleware(this.config.get('UPLOAD_DIRECTORY'), 'avatar'),
      ]
    });
  }

  public async create(req: CreateUserRequest, res: Response) {
    const { body} = req;
    const existsUser = await this.userService.findByEmail(body.email);

    if (existsUser) {
      throw new HttpError(
        StatusCodes.CONFLICT,
        `User with email «${body.email}» exists.`,
        'UserController'
      );
    }
    const avatarUrl = `http://localhost:${this.config.get('PORT')}${Storages.static}/default_avatar.png`;
    const result = await this.userService.create({...body, avatarUrl });
    this.created(res, fillDto(UserRdo, result));
  }

  public async login(req: LoginUserRequest, res: Response) {
    const { body} = req;
    const result = await this.userService.login(body);

    if (result){
      return this.success(res, { accessToken: '1' }); // @TODO not completed yet
    }

    throw new HttpError(
      StatusCodes.NOT_FOUND,
      `User with email «${body.email}» or password does not match any user details.`,
      'UserController'
    );
  }

  public async check(req: GetUserRequest, res: Response) {
    // @TODO not completed yet
    const result = await this.userService.findById(req.params.id);
    this.success(res, fillDto(UserRdo, result));
  }


  public async getById(req: GetUserRequest, res: Response) {
    const result = await this.userService.findById(req.params.id);
    if (result){
      return this.success(res, fillDto(UserRdo, result));
    }

    throw new HttpError(
      StatusCodes.NOT_FOUND,
      `User with id «${req.params.id}» not found.`,
      'UserController'
    );
  }

  public async addFavouriteOffer(req: AddUserFavouriteOfferRequest, res: Response) {
    const { body} = req;
    const isOfferExist = await this.offerService.exists(body.offerId);

    if (isOfferExist) {
      const result = await this.userService.addFavouriteOffer(req.params.id, body.offerId);
      this.success(res, fillDto(UserRdo, result));
    } else {
      throw new HttpError(
        StatusCodes.BAD_REQUEST,
        `Offer with id «${body.offerId}» does not exists and can not be add as a user favourite one.`,
        'UserController'
      );
    }
  }

  public async removeFavouriteOffer(req: RemoveUserFavouriteOfferRequest, res: Response) {
    const result = await this.userService.removeFavouriteOffer(req.params.id, req.params.offerId);
    this.success(res, fillDto(UserRdo, result));
  }

  public async uploadAvatar(req: UploadUserAvatarRequest, res: Response): Promise<void> {
    const { params} = req;

    if (params.id) {
      const avatarUrl = `http://localhost:${this.config.get('PORT')}${Storages.upload}/${req.file?.filename}`;
      const result = await this.userService.update(params.id, { avatarUrl });
      return this.success(res, fillDto(UserRdo, result));
    }

    throw new HttpError(
      StatusCodes.BAD_REQUEST,
      `Not able to read user id: ${params.id}.`,
      'UserController'
    );
  }
}
