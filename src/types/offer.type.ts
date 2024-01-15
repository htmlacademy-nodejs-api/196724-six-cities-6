import {City} from './city.enums';
import {PropertyType} from './property-type.enums';
import {Location} from './location.type';
import {Facility} from './facility.enums';

export type Offer = {
  name: string;
  description: string;
  postDate: string;
  city: City;
  preview_url: string;
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
