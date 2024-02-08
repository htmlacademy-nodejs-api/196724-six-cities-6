import { City, Facility, PropertyType } from '../../types/index.js';
import { CreateLocation } from './create-location-dto.js';

export class CreateOfferDto {
  public userId: string;
  public name: string;
  public description: string;
  public postDate: string;
  public city: City;
  public price: number;
  public previewUrl: string;
  public urls: string[];
  public isPremium: boolean;
  public type: PropertyType;
  public bedrooms: number;
  public guests: number;
  public facilities: Facility[];
  public location: CreateLocation;
}
