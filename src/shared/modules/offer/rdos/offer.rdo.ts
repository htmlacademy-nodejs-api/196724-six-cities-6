import { Expose, Type } from 'class-transformer';
import { User } from '../../../types/index.js';
import { OfferLiteRdo } from './offer.lite.rdo.js';
import { UserRdo } from '../../user/index.js';

export class OfferRdo extends OfferLiteRdo {
  @Expose()
  public userId: string;

  @Expose()
  public description: string;

  @Expose()
  public bedrooms: number;

  @Expose()
  public guests: number;

  @Expose()
  public urls: string[];

  @Expose()
  public facilities: string[];

  @Expose({ name: 'userId'})
  @Type(() => UserRdo)
  public author: User;
}
