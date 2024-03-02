import { DocumentType, types } from '@typegoose/typegoose';
import { UserEntity } from './user.entity.js';
import { IUserService} from './user-service.interface.js';
import { inject, injectable } from 'inversify';
import { Components } from '../../types/index.js';
import { ILogger} from '../../libs/logger/index.js';
import { CreateUserDto } from './dtos/index.js';
import { ApplicationSchema, IConfig } from '../../libs/config/index.js';
import mongoose from 'mongoose';
import { getGeneratedSHA256 } from '../../utils/index.js';
import {UserMessages} from './user.messages.js';

@injectable()
export class UserService implements IUserService {
  constructor(
    @inject(Components.UserModel) private readonly userModel: types.ModelType<UserEntity>,
    @inject(Components.Logger) private readonly logger: ILogger,
    @inject(Components.Config) public readonly config?: IConfig<ApplicationSchema>
  ) {}

  private get salt() {
    return this.config?.get('SALT');
  }

  private get port() {
    return this.config?.get('PORT');
  }

  private get host() {
    return this.config?.get('HOST');
  }

  public async create(dto: CreateUserDto): Promise<DocumentType<UserEntity>> {
    const user = new UserEntity(dto);

    if (this.host && this.port && this.salt) {
      const password = getGeneratedSHA256(dto.password, this.salt);

      user.setPassword(password);
      const result = await this.userModel.create(user);
      this.logger.info(`New user created: ${user.email}`);
      return result;
    }

    throw Error(UserMessages.config);
  }

  public async uploadAvatar(id: string, fileName: string): Promise<DocumentType<UserEntity> | null> {
    if (this.host && this.port) {
      const result = await this.userModel.findByIdAndUpdate(id, { avatarUrl: fileName }, { new: true }).exec();
      this.logger.info(`User (${ result?.name }) details  updated.`);
      return result;
    }

    throw Error(UserMessages.config);
  }

  public findById(id: string): Promise<DocumentType<UserEntity> | null> {
    const user = this.userModel.findById(id).exec();
    if (user) {
      return user;
    }
    throw Error(UserMessages.notFound(id));
  }

  public async findByEmail(email: string): Promise<DocumentType<UserEntity> | null> {
    const user = this.userModel.findOne({ email }).exec();
    if (user) {
      return user;
    }
    throw Error(UserMessages.notFound(email));
  }

  public addFavouriteOffer(id: string, offerId: string): Promise<DocumentType<UserEntity> | null> {
    return this.userModel.findByIdAndUpdate(
      id,
      { $addToSet: { favourites: offerId } },
      { new: true }
    );
  }

  public removeFavouriteOffer(id: string, offerId: string): Promise<DocumentType<UserEntity> | null> {
    return this.userModel.findByIdAndUpdate(id, { $pull: { favourites: offerId } }, { new: true });
  }

  public async exists(id: string): Promise<boolean> {
    return !!(await this.userModel.exists({_id: new mongoose.Types.ObjectId(id)}));
  }
}
