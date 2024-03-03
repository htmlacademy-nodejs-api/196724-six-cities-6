import { OfferGenerator } from './offer-generator.interface.js';
import { City, Facility, MockedOffers, PropertyType } from '../../types/index.js';
import {
  getRandomIsoDate,
  getRandomItem,
  getRandomNumber,
  getSlicedRandomArray
} from '../../utils/index.js';
import {
  OfferBedroomsConstraints,
  OfferPriceConstraints,
  OfferGuestsConstraints,
  OfferFacilitiesConstraints
} from '../../modules/offer/validators/index.js';


enum LongitudeConstraints {
  min = -180,
  max = 180
}
const LONG_LAT_FRACTION_DIGITS = 3;

export class TsvOfferGenerator implements OfferGenerator {
  constructor(private readonly offersData: MockedOffers) {}

  generate(): string {
    const allPropertyTypes: string[] = Array.from(Object.values(PropertyType));
    const allCities: string[] = Array.from(Object.values(City));
    const allFacilities: string[] = Array.from(Object.values(Facility));
    const maxFacilities = getRandomNumber(OfferFacilitiesConstraints.Min, allFacilities.length - 1);
    const name = getRandomItem(this.offersData.names);
    const description = getRandomItem(this.offersData.descriptions);
    const postData = getRandomIsoDate();
    const city = getRandomItem(allCities);
    const price = getRandomNumber(OfferPriceConstraints.Min, OfferPriceConstraints.Max);
    const previewUrl = getRandomItem(this.offersData.urls);
    const urls = getSlicedRandomArray(this.offersData.urls).join(',');
    const isPremium = getRandomNumber(0, 1);
    const type = getRandomItem(allPropertyTypes);
    const bedrooms = getRandomNumber(OfferBedroomsConstraints.Min, OfferBedroomsConstraints.Max);
    const guests = getRandomNumber(OfferGuestsConstraints.Min, OfferGuestsConstraints.Max);
    const facilities = getSlicedRandomArray(allFacilities, maxFacilities).join(',');
    const userId = getRandomItem(this.offersData.userIds);
    const location = `${getRandomNumber(LongitudeConstraints.min, LongitudeConstraints.max, true).toFixed(LONG_LAT_FRACTION_DIGITS)},${getRandomNumber(LongitudeConstraints.min, LongitudeConstraints.max, true).toFixed(LONG_LAT_FRACTION_DIGITS)}`;

    return [
      name, description, postData, city, price, previewUrl, urls, isPremium,
      type, bedrooms, guests, facilities, userId, location
    ].join('\t');
  }
}
