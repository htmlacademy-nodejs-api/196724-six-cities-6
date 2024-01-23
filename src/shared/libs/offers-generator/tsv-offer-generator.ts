import { OfferGenerator } from './offer-generator.interface.js';
import { City, Facility, MockedOffers, PropertyType } from '../../types/index.js';
import {
  getRandomIsoDate,
  getRandomItem,
  getRandomNumber,
  getSlicedRandomArray
} from '../../utils/index.js';

const MIN_PRICE = 100;
const MAX_PRICE = 100000;
const MIN_BEDROOMS = 1;
const MAX_BEDROOMS = 8;
const MIN_GUESTS = 1;
const MAX_GUESTS = 10;
const MIN_RATING = 1;
const MAX_RATING = 8;
const MIN_FACILITIES = 1;
const MIN_LONG_LAT = -180;
const MAX_LONG_LAT = 180;
const LONG_LAT_FRACTION_DIGITS = 3;

export class TsvOfferGenerator implements OfferGenerator {
  constructor(private readonly offersData: MockedOffers) {}

  generate(): string {
    const allPropertyTypes: string[] = Array.from(Object.values(PropertyType));
    const allCities: string[] = Array.from(Object.values(City));
    const allFacilities: string[] = Array.from(Object.values(Facility));
    const maxFacilities = getRandomNumber(MIN_FACILITIES, allFacilities.length - 1);
    const name = getRandomItem(this.offersData.names);
    const description = getRandomItem(this.offersData.descriptions);
    const postData = getRandomIsoDate();
    const city = getRandomItem(allCities);
    const price = getRandomNumber(MIN_PRICE, MAX_PRICE);
    const previewUrl = getRandomItem(this.offersData.urls);
    const urls = getSlicedRandomArray(this.offersData.urls).join(',');
    const isPremium = getRandomNumber(0, 1);
    const isFavourite = getRandomNumber(0, 1);
    const rating = getRandomNumber(MIN_RATING, MAX_RATING);
    const type = getRandomItem(allPropertyTypes);
    const bedrooms = getRandomNumber(MIN_BEDROOMS, MAX_BEDROOMS);
    const guests = getRandomNumber(MIN_GUESTS, MAX_GUESTS);
    const facilities = getSlicedRandomArray(allFacilities, maxFacilities).join(',');
    const createdBy = getRandomItem(this.offersData.creators);
    const location = `${getRandomNumber(MIN_LONG_LAT, MAX_LONG_LAT, true).toFixed(LONG_LAT_FRACTION_DIGITS)},${getRandomNumber(MIN_LONG_LAT, MAX_LONG_LAT, true).toFixed(LONG_LAT_FRACTION_DIGITS)}`;

    return [
      name, description, postData, city, price, previewUrl, urls, isPremium,
      isFavourite, rating, type, bedrooms, guests, facilities, createdBy, location
    ].join('\t');
  }
}
