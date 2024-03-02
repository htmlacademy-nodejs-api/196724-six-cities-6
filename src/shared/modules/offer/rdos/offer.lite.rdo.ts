import { Expose } from 'class-transformer';
import {Location} from '../../../types/index.js';

export class OfferLiteRdo {
  @Expose()
  public id: string;

  @Expose()
  public name: string;

  @Expose()
  public price: number;

  @Expose()
  public type: string;

  @Expose()
  public isFavourite: boolean;

  @Expose()
  public isPremium: boolean;

  @Expose()
  public postDate: string;

  @Expose()
  public city: string;

  @Expose()
  public location: Location;

  @Expose()
  public previewUrl: string;

  @Expose()
  public rating: number;

  @Expose()
  public commentsCount: number;
}
