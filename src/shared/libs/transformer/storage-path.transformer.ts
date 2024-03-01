import { inject, injectable } from 'inversify';
import { Components, Offer, Storage, User } from '../../types/index.js';
import { ILogger } from '../logger/index.js';
import { DefaultFiles } from './default-files.enums.js';
import { AUTHOR_PROPERTIES, OFFER_TRANSFORM_PROPERTIES, USER_TRANSFORM_PROPERTIES } from './storage-path.constants.js';
import { getStorageUrl } from '../../utils/index.js';
import { ApplicationSchema, IConfig } from '../config/index.js';

@injectable()
export class StoragePathTransformer {
  constructor(
    @inject(Components.Logger) private readonly logger: ILogger,
    @inject(Components.Config) private readonly config: IConfig<ApplicationSchema>,
  ) {
    this.logger.info('StoragePathTransformer created!');
  }

  private isUserAvatarKey = (key: string) => USER_TRANSFORM_PROPERTIES.includes(key);

  private isOfferUrl = (key: string) => OFFER_TRANSFORM_PROPERTIES.includes(key);

  private isDefaultProperty = (value: string) => value === DefaultFiles.Avatar;
  private isAuthorKey = (key: string) => AUTHOR_PROPERTIES === key;

  private get host() {
    return this.config.get('HOST');
  }

  private get port() {
    return this.config.get('PORT');
  }

  private generateStorageUrl = (fileName: string, isStaticStorage: boolean) => getStorageUrl({
    host: this.host,
    port: this.port,
    storage: isStaticStorage ? Storage.static : Storage.upload,
    fileName
  });

  private transformAvatarUrl = (fileName: string): Pick<User, 'avatarUrl'> => ({
    avatarUrl: this.generateStorageUrl(fileName, this.isDefaultProperty(fileName))
  });

  private transformOfferUrl = (value: string | string[]): Partial<Pick<Offer, 'previewUrl' | 'urls'>> => {
    if (value instanceof Array) {
      return { urls: value.map((fileName) => this.generateStorageUrl(fileName, true)) };
    } else {
      return { previewUrl: this.generateStorageUrl(value, true) };
    }
  };

  public execute = (data: Record<string, unknown>): Record<string, unknown> => Object.keys(data).reduce((acc, key) => {
    if (this.isAuthorKey(key)) {
      const author = data[key] as Record<string, unknown>;
      return {...acc, author: this.execute(author)};
    }

    if (this.isUserAvatarKey(key)) {
      return {...acc, ...{...data, ...this.transformAvatarUrl(data[key] as string)}};
    }

    if (this.isOfferUrl(key)) {
      return {...acc, ...this.transformOfferUrl(data[key] as string | string[])};
    }


    return acc;
  }, data);
}
