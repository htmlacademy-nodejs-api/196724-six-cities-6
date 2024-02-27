import { Controller, HttpMethod } from '../../libs/controller/index.js';
import { inject, injectable } from 'inversify';
import { Components } from '../../types/index.js';
import { ILogger } from '../../libs/logger/index.js';
import { IUserService } from './user-service.interface.js';
import {Request, Response} from 'express';
import { fillDto } from '../../utils/index.js';
import {LoginUserRdo, UserRdo} from './rdos/index.js';
import {Controller, HttpMethod} from '../../libs/controller/index.js';
import {inject, injectable} from 'inversify';
import {Components } from '../../types/index.js';
import {ILogger} from '../../libs/logger/index.js';
import {IUserService} from './user-service.interface.js';
import {Response} from 'express';
import {fillDto } from '../../utils/index.js';
import {UserRdo} from './rdos/index.js';
import {
  AddUserFavouriteOfferRequest,
  CreateUserRequest,
  LoginUserRequest,
  RemoveUserFavouriteOfferRequest,
  UploadUserAvatarRequest
} from './types/index.js';
import {HttpError} from '../../libs/exeption-filter/index.js';
import {StatusCodes} from 'http-status-codes';
import {IOfferService} from '../offer/index.js';
import {
  DocumentExistsMiddleware,
  IMiddleware,
  UploadFileMiddleware,
  ValidateDtoMiddleware,
  ValidateObjectIdMiddleware
} from '../../libs/middleware/index.js';
import {AddUserFavouriteOfferDto, CreateUserDto, LoginUserDto} from './dtos/index.js';
import {userAddFavouriteOfferValidator, userCreateValidator, userLoginValidator} from './validators/index.js';
import {ApplicationSchema, IConfig} from '../../libs/config/index.js';
import { HttpError } from '../../libs/exeption-filter/index.js';
import { StatusCodes } from 'http-status-codes';
import { IOfferService } from '../offer/index.js';
import {
  PrivateRouteMiddleware,
  ValidateDtoMiddleware,
  ValidateObjectIdMiddleware
} from '../../libs/middleware/index.js';
import { CreateUserDto, LoginUserDto} from './dtos/index.js';
import { userAddFavouriteOfferValidator, userCreateValidator, userLoginValidator } from './validators/index.js';
import { AddUserFavouriteOfferDto } from './dtos/add-user-favourite-offer-dto.js';
import { IAuthService } from '../auth/index.js';
import { UserEntity } from './user.entity.js';

@injectable()
export class UserController extends Controller {
  private readonly validateObjectIdMiddleware: IMiddleware;

  constructor(
    @inject(Components.Logger) protected readonly logger: ILogger,
    @inject(Components.UserService) private readonly userService: IUserService,
    @inject(Components.OfferService) private readonly offerService: IOfferService,
    @inject(Components.AuthService) private readonly authService: IAuthService,
    @inject(Components.Config) private readonly config: IConfig<ApplicationSchema>,
  ) {
    super(logger);
    this.logger.info('Register routes for UserController ...');

    this.validateObjectIdMiddleware = new ValidateObjectIdMiddleware(['offerId']);

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
      path: '/check',
      method: HttpMethod.Get,
      handler: this.check,
      middleware: [new PrivateRouteMiddleware()]
    });

    this.addRoute({
      path: '/offers/favourite/add',
      method: HttpMethod.Post,
      handler: this.addFavouriteOffer,
      middleware: [
        new PrivateRouteMiddleware(),
        this.validateObjectIdMiddleware,
        new ValidateDtoMiddleware(AddUserFavouriteOfferDto, userAddFavouriteOfferValidator)
      ]
    });

    this.addRoute({
      path: '/offers/favourite/:offerId/remove',
      method: HttpMethod.Delete,
      handler: this.removeFavouriteOffer,
      middleware: [new PrivateRouteMiddleware(), this.validateObjectIdMiddleware]
    });

    this.addRoute({
      path: '/:id/avatar',
      method: HttpMethod.Post,
      handler: this.uploadAvatar,
      middleware: [
        new UploadFileMiddleware(this.config.get('UPLOAD_DIRECTORY'), 'avatar'),
        this.validateObjectIdMiddleware,
        new DocumentExistsMiddleware(this.userService, 'User', 'id'),
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
    const result = await this.userService.create(body);
    this.created(res, fillDto(UserRdo, result));
  }

  public async login(req: LoginUserRequest, res: Response) {
    const { body} = req;
    const user: UserEntity | null = await this.authService.verify(body);

    if (user) {
      const accessToken: string = await this.authService.authenticate(user);
      const data: LoginUserRdo = fillDto(LoginUserRdo, { accessToken });
      return this.success(res, data);
    } else {
      throw new HttpError(
        StatusCodes.NOT_FOUND,
        `User with email «${body.email}».`,
        'UserController'
      );
    }
  }

  public async check(req: Request, res: Response) {
    const result = await this.userService.findById(req.tokenPayload.id);
    this.success(res, fillDto(UserRdo, result));
  }

  public async addFavouriteOffer(req: AddUserFavouriteOfferRequest, res: Response) {
    const { body, tokenPayload} = req;
    const isOfferExist = await this.offerService.exists(body.offerId);

    if (isOfferExist) {
      const result = await this.userService.addFavouriteOffer(tokenPayload.id, body.offerId);
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
    const result = await this.userService.removeFavouriteOffer(req.tokenPayload.id, req.params.offerId);
    this.success(res, fillDto(UserRdo, result));
  }

  public async uploadAvatar(req: UploadUserAvatarRequest, res: Response): Promise<void> {
    const { params} = req;

    if (params.id && req.file?.filename) {
      const result = await this.userService.uploadAvatar(params.id, req.file?.filename);
      return this.success(res, fillDto(UserRdo, result));
    }

    throw new HttpError(
      StatusCodes.BAD_REQUEST,
      `Not able to read user id: ${params.id}.`,
      'UserController'
    );
  }
}
