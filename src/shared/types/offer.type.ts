import { City } from './city.enums.js';
import { PropertyType } from './property-type.enums.js';
import { Location } from './location.type.js';
import { Facility } from './facility.enums.js';

export type Offer = {
  userId: string;
  name: string;
  description: string;
  postDate: string;
  city: City;
  price: number;
  previewUrl: string;
  urls: string[];
  type: PropertyType;
  bedrooms: number
  guests: number,
  facilities: Facility[];
  location: Location;
  commentsCount?: number;
  isPremium?: boolean;
  isFavourite?: boolean;
  rating?: number,
}
