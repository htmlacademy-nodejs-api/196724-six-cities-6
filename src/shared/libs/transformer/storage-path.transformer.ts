import { inject, injectable } from 'inversify';
import { Components, Offer, Storage, User } from '../../types/index.js';
import { ILogger } from '../logger/index.js';
import { DefaultFiles } from './default-files.enums.js';
import { getStorageUrl } from '../../utils/index.js';
import { ApplicationSchema, IConfig } from '../config/index.js';
import { getTransformPaths } from './utils/index.js';

@injectable()
export class StoragePathTransformer {
  constructor(
    @inject(Components.Logger) private readonly logger: ILogger,
    @inject(Components.Config) private readonly config: IConfig<ApplicationSchema>,
  ) {
    this.logger.info('StoragePathTransformer created!');
  }

  private isDefaultProperty = (value: string) => value === DefaultFiles.Avatar;

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

  public execute = (data: Record<string, unknown>): Record<string, unknown> => getTransformPaths(data, this.transformAvatarUrl, this.transformOfferUrl);
}
