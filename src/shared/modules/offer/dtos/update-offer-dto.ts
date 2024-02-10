import { City, Facility, PropertyType, Location } from '../../../types/index.js';
export class UpdateOfferDto {
  public name?: string;
  public description?: string;
  public postDate?: string;
  public city?: City;
  public price?: number;
  public previewUrl?: string;
  public urls?: string[];
  public type?: PropertyType;
  public bedrooms?: number;
  public guests?: number;
  public facilities?: Facility[];
  public location?: Location;
  public isPremium?: boolean;
}
