import { IAuthService } from './auth-service.interface.js';
import { inject, injectable } from 'inversify';
import { IUserService, LoginUserDto, UserEntity } from '../user/index.js';
import { Components } from '../../types/index.js';
import { ILogger } from '../../libs/logger/index.js';
import { ApplicationSchema, IConfig } from '../../libs/config/index.js';
import * as crypto from 'node:crypto';
import { JWT_ALGORITHM, TokenPayload } from './types/index.js';
import { SignJWT } from 'jose';
import { UserNotFoundException, UserPasswordIncorrectException } from './errors/index.js';

@injectable()
export class AuthService implements IAuthService {
  constructor(
    @inject(Components.Logger) private readonly logger: ILogger,
    @inject(Components.UserService) private readonly userService: IUserService,
    @inject(Components.Config) private readonly config: IConfig<ApplicationSchema>,
  ) {}

  public authenticate(user: UserEntity): Promise<string> {
    const jwtSecret: string = this.config.get('JWT_SECRET');
    const jwtExpiredTime: string = this.config.get('JWT_EXPIRED');
    const secretKey = crypto.createSecretKey(jwtSecret, 'utf-8');
    const tokenPayload: TokenPayload = {
      id: user.id,
    };

    this.logger.info(`Create token for ${user.email}`);
    return new SignJWT(tokenPayload)
      .setProtectedHeader({ alg: JWT_ALGORITHM })
      .setIssuedAt()
      .setExpirationTime(jwtExpiredTime)
      .sign(secretKey);
  }

  public async verify(dto: LoginUserDto): Promise<UserEntity | null> {
    const user = await this.userService.findByEmail(dto.email);
    if (!user) {
      this.logger.warn(`User with ${dto.email} not found!`);
      throw new UserNotFoundException();
    }

    const isVerified: boolean = user.verifyPassword(dto.password, this.config.get('SALT'));
    if (!isVerified) {
      this.logger.warn(`Incorrect password for ${dto.email}!`);
      throw new UserPasswordIncorrectException();
    }

    return user;
  }

}
