import { CreateOfferDto, LocationDto } from '../dtos';
import {Location, NewComment, NewOffer} from '../../types/types';
import { CreateCommentDto} from '../dtos/commments/index.js';
import {MIN_OFFER_IMAGES, OFFER_STATIC_URLS} from '../../const';
import {getRandomItem, getSlicedRandomArray} from '../../utils';

const locationToDto = (dto: Location): LocationDto => ({lat: dto.latitude, long: dto.longitude});
export const offerToDto = (offer: NewOffer): CreateOfferDto => ({
  name: offer.title,
  description: offer.description,
  type: offer.type,
  price: offer.price,
  facilities: offer.goods,
  bedrooms: offer.bedrooms,
  guests: offer.maxAdults,
  postDate: new Date().toISOString(),
  isPremium: offer.isPremium,
  city: offer.city.name,
  location: locationToDto(offer.location),
  previewUrl: getRandomItem(OFFER_STATIC_URLS),
  urls: getSlicedRandomArray(OFFER_STATIC_URLS, MIN_OFFER_IMAGES)
});

export const commentToDto = (comment: NewComment, offerId: string): CreateCommentDto => ({
  offerId,
  text: comment.comment,
  rating: comment.rating,
  publishDate: new Date().toISOString(),
});
