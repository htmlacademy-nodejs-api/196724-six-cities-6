import {Controller, HttpMethod} from '../../libs/controller/index.js';
import {
  DocumentExistsMiddleware,
  IMiddleware,
  PrivateRouteMiddleware, UploadFileMiddleware,
  ValidateDtoMiddleware,
  ValidateObjectIdMiddleware
} from '../../libs/middleware/index.js';
import {inject, injectable} from 'inversify';
import {Components} from '../../types/index.js';
import {ILogger} from '../../libs/logger/index.js';
import {IUserService} from './user-service.interface.js';
import {IOfferService, OfferMessages} from '../offer/index.js';
import {IAuthService} from '../auth/index.js';
import {ApplicationSchema, IConfig} from '../../libs/config/index.js';
import {AddUserFavouriteOfferDto, CreateUserDto, LoginUserDto} from './dtos/index.js';
import {userAddFavouriteOfferValidator, userCreateValidator, userLoginValidator} from './validators/index.js';
import {
  AddUserFavouriteOfferRequest,
  CreateUserRequest,
  LoginUserRequest,
  RemoveUserFavouriteOfferRequest, UploadUserAvatarRequest
} from './types/index.js';
import {Request, Response} from 'express';
import {StatusCodes} from 'http-status-codes';
import {fillDto} from '../../utils/index.js';
import {LoginUserRdo, UserRdo} from './rdos/index.js';
import {UserEntity} from './user.entity.js';
import {HttpError} from '../../libs/errors/index.js';
import {UserMessages} from './user.messages.js';

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

    this.validateObjectIdMiddleware = new ValidateObjectIdMiddleware(['offerId', 'id']);

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

  public async create({ body }: CreateUserRequest, res: Response) {
    const existsUser = await this.userService.findByEmail(body.email);

    if (existsUser) {
      throw new HttpError(
        StatusCodes.CONFLICT,
        UserMessages.exists(body.email),
        'UserController'
      );
    }
    const result = await this.userService.create(body);
    this.created(res, fillDto(UserRdo, result));
  }

  public async login({ body }: LoginUserRequest, res: Response) {
    const user: UserEntity | null = await this.authService.verify(body);

    if (user) {
      const accessToken: string = await this.authService.authenticate(user);
      const data: LoginUserRdo = fillDto(LoginUserRdo, { accessToken });
      return this.success(res, data);
    } else {
      throw new HttpError(
        StatusCodes.NOT_FOUND,
        UserMessages.notFound(body.email),
        'UserController'
      );
    }
  }

  public async check({ tokenPayload: { id }}: Request, res: Response) {
    const result = await this.userService.findById(id);
    if(result) {
      this.success(res, fillDto(UserRdo, result));
    } else {
      throw new HttpError(
        StatusCodes.NOT_FOUND,
        UserMessages.notFound(id),
        'UserController'
      );
    }
  }

  public async addFavouriteOffer({ body, tokenPayload: { id }}: AddUserFavouriteOfferRequest, res: Response) {
    const isOfferExist = await this.offerService.exists(body.offerId);
    if (isOfferExist) {
      const result = await this.userService.addFavouriteOffer(id, body.offerId);
      this.success(res, fillDto(UserRdo, result));
    } else {
      throw new HttpError(
        StatusCodes.BAD_REQUEST,
        OfferMessages.notFound(body.offerId),
        'UserController'
      );
    }
  }

  public async removeFavouriteOffer({tokenPayload: { id }, params: { offerId }}: RemoveUserFavouriteOfferRequest, res: Response) {
    const result = await this.userService.removeFavouriteOffer(id, offerId);
    this.success(res, fillDto(UserRdo, result));
  }

  public async uploadAvatar({ file, params: { id } }: UploadUserAvatarRequest, res: Response): Promise<void> {

    if (file?.filename) {
      const result = await this.userService.uploadAvatar(id, file?.filename);
      return this.success(res, fillDto(UserRdo, result));
    }

    throw new HttpError(
      StatusCodes.BAD_REQUEST,
      UserMessages.notFound(id),
      'UserController'
    );
  }
}
