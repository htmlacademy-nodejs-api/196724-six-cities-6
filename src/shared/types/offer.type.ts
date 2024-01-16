import {City} from './city.enums.js';
import {PropertyType} from './property-type.enums.js';
import {Location} from './location.type.js';
import {Facility} from './facility.enums.js';

export type Offer = {
  name: string;
  description: string;
  postDate: Date;
  city: City;
  price: number;
  previewUrl: string;
  urls: string[];
  isPremium: boolean;
  isFavourite: boolean;
  rating: number,
  type: PropertyType;
  bedrooms: number
  guests: number,
  facilities: Facility[];
  createdBy: string;
  location: Location;
  commentsCount?: number;
}
