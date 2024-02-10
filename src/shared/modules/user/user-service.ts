import { DocumentType, types } from '@typegoose/typegoose';
import { UserEntity } from './user.entity.js';
import { IUserService } from './user-service.interface.js';
import { inject, injectable } from 'inversify';
import { Components } from '../../types/index.js';
import { ILogger } from '../../libs/logger/index.js';
import { LoginUserDto, CreateUserDto } from './dtos/index.js';
import { ApplicationSchema, IConfig } from '../../libs/config/index.js';

@injectable()
export class UserService implements IUserService {
  constructor(
    @inject(Components.UserModel) private readonly userModel: types.ModelType<UserEntity>,
    @inject(Components.Logger) private readonly logger: ILogger,
    @inject(Components.Config) public readonly config?: IConfig<ApplicationSchema>
  ) {}

  public async create(dto: CreateUserDto): Promise<DocumentType<UserEntity>> {
    const salt = this.config && this.config.get('SALT');
    const user = new UserEntity(dto);

    if (salt) {
      user.setPassword(salt);
      const result = await this.userModel.create(user);
      this.logger.info(`New user created: ${user.email}`);
      return result;
    }

    throw Error('SALT has not been provided for password hashing.');
  }

  public async findById(id: string): Promise<DocumentType<UserEntity> | null> {
    const user = this.userModel.findOne({ _id: id }).exec();
    if (user) {
      return user;
    }
    throw Error(`User with id: ${id} has not been found!`);
  }

  // @TODO just a placeholder method
  public async login(dto: LoginUserDto): Promise<string> {
    return Promise.resolve(dto.email);
  }

  // @TODO just a placeholder method
  public async check(): Promise<DocumentType<UserEntity> | null>{
    return Promise.resolve(null);
  }

  public addFavouriteOffer(id: string, offerId: string): Promise<DocumentType<UserEntity> | null> {
    return this.userModel.findByIdAndUpdate(
      id,
      { $addToSet: { favourites: offerId } },
      { new: true }
    );
  }

  public removeFavouriteOffer(id: string, offerId: string): Promise<DocumentType<UserEntity> | null> {
    return this.userModel.findByIdAndUpdate(id, { $unset: { favourites: offerId } }, { new: true });
  }
}
