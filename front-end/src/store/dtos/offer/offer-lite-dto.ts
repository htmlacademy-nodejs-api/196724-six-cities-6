import {LocationDto} from './location-dto.js';

export class OfferLiteDto {
  public id!: string;
  public name!: string;
  public price!: number;
  public type!: string;
  public isFavourite!: boolean;
  public isPremium!: boolean;
  public postDate!: string;
  public city!: string;
  public previewUrl!: string;
  public rating!: number;
  public commentsCount!: number;
  public location!: LocationDto;
}
