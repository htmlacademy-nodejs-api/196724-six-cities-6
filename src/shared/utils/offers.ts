import {City, Facility, Location, Offer, PropertyType} from '../types/index.js';

export const getLocation = (location: string): Location => {
  const [ long, lat ] = location.split(',');
  return { long: Number(long), lat: Number(lat) };
};

export const mapToOffer = (data: string): Offer => {
  const [
    name, description, postDate, city, price,
    previewUrl, urls, isPremium, isFavourite,
    rating, type, bedrooms, guests, facilities,
    userId, location
  ] = data.replace('\n', '').split('\t');
  return {
    name,
    description,
    postDate,
    city: city as City,
    previewUrl,
    urls: urls.split(','),
    isPremium: !!Number(isPremium),
    isFavourite: !!Number(isFavourite),
    rating: Number(rating),
    price: Number.parseInt(price, 10),
    type: type as PropertyType,
    bedrooms: Number(bedrooms),
    guests: Number(guests),
    facilities: facilities.split(',') as Facility[],
    userId,
    location: getLocation(location),
  };
};
