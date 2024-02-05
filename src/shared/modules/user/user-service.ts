import { DocumentType, types } from '@typegoose/typegoose';
import { CreateUserDto} from './create-user-dto.interface.js';
import { UserEntity } from './user.entity.js';
import { IUserService } from './user-service.interface.js';
import { inject, injectable } from 'inversify';
import { Components } from '../../types/index.js';
import { Logger } from '../../libs/logger/index.js';
import { ApplicationSchema, IConfig } from '../../libs/config/index.js';

@injectable()
export class UserService implements IUserService {
  constructor(
    @inject(Components.Logger) private readonly logger: Logger,
    @inject(Components.UserModel) private readonly userModel: types.ModelType<UserEntity>,
    @inject(Components.Config) private readonly config: IConfig<ApplicationSchema>
  ) {}

  get salt() {
    return this.config.get('SALT');
  }

  public async create(dto: CreateUserDto): Promise<DocumentType<UserEntity>> {
    const user = new UserEntity(dto);
    if (this.salt) {
      user.setPassword(this.salt);
      const result = this.userModel.create(user);
      this.logger.info(`New user created: ${user.email}`);
      return result;
    }

    throw Error('SALT has not been provided for password hashing.');
  }

  public async findByEmail(email: string): Promise<DocumentType<UserEntity> | null> {
    const user = this.userModel.findOne({ email });
    if (user) {
      return user;
    }
    throw Error(`User with email: ${email} has not been found!`);
  }

  public async findById(id: string): Promise<DocumentType<UserEntity> | null> {
    const user = this.userModel.findOne({ _id: id });
    if (user) {
      return user;
    }
    throw Error(`User with id: ${id} has not been found!`);
  }
}
