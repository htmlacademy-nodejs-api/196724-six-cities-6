import { Expose } from 'class-transformer';
import { Location } from '../../../types/index.js';
import { OfferLiteRdo } from './offer.lite.rdo.js';

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

  @Expose()
  public location: Location;
}
