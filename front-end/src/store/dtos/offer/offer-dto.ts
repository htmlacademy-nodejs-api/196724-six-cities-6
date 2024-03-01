import { OfferLiteDto } from './offer-lite-dto.js';
import { LocationDto } from './location-dto.js';
import { UserDto } from '../user/index.js';

export class OfferDto extends OfferLiteDto {
  public userId!: string;
  public description!: string;
  public bedrooms!: number;
  public guests!: number;
  public urls!: string[];
  public facilities!: string[];
  public location!: LocationDto;
  public author!: UserDto;
}
