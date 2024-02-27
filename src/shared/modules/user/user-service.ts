import { DocumentType, types } from '@typegoose/typegoose';
import { UserEntity } from './user.entity.js';
import { IUserService} from './user-service.interface.js';
import { inject, injectable } from 'inversify';
import { Components, Storage } from '../../types/index.js';
import { ILogger} from '../../libs/logger/index.js';
import { CreateUserDto, LoginUserDto } from './dtos/index.js';
import { ApplicationSchema, IConfig } from '../../libs/config/index.js';
import { getGeneratedSHA256, getStorageUrl } from '../../utils/index.js';
import mongoose from 'mongoose';

const DEFAULT_AVATAR_FILE_NAME: string = 'default_avatar.png';
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

    if (this.salt && this.host && this.port) {
      user.setPassword(this.salt);
      const avatarUrl: string = getStorageUrl({
        port: this.port,
        host: this.host,
        storage: Storage.static,
        fileName: DEFAULT_AVATAR_FILE_NAME
      });

      const result = await this.userModel.create({...user, avatarUrl});
      this.logger.info(`New user created: ${user.email}`);
      return result;
    }

    throw Error('SALT, HOST, or POrt has not been provided for password hashing.');
  }

  public async uploadAvatar(id: string, fileName: string): Promise<DocumentType<UserEntity> | null> {
    if (this.host && this.port) {
      const avatarUrl: string = getStorageUrl({ port: this.port, host: this.host,storage: Storage.upload, fileName });
      const result = await this.userModel.findByIdAndUpdate(id, { avatarUrl }, { new: true }).exec();
      this.logger.info(`User (${ result?.name }) details  updated.`);
      return result;
    }

    throw Error('SALT, HOST, or POrt has not been provided for password hashing.');

  }

  public findById(id: string): Promise<DocumentType<UserEntity> | null> {
    const user = this.userModel.findById(id).exec();
    if (user) {
      return user;
    }
    throw Error(`User with id: ${id} has not been found!`);
  }

  public async findByEmail(email: string): Promise<DocumentType<UserEntity> | null> {
    const user = this.userModel.findOne({ email }).exec();
    if (user) {
      return user;
    }
    throw Error(`User with id: ${email} has not been found!`);
  }

  // @TODO just a placeholder method
  public async login(dto: LoginUserDto): Promise<DocumentType<UserEntity> | null> {
    if(this.salt) {
      const password = getGeneratedSHA256(dto.password, this.salt);
      return this.userModel.findOne({ email: dto.email, password });

    }
    throw Error('SALT not found in application config');
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
    return this.userModel.findByIdAndUpdate(id, { $pull: { favourites: offerId } }, { new: true });
  }

  public async exists(id: string): Promise<boolean> {
    return !!(await this.userModel.exists({_id: new mongoose.Types.ObjectId(id)}));
  }
}
