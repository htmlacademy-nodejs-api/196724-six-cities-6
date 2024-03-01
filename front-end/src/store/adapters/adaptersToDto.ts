import { CreateOfferDto, LocationDto } from '../dtos';
import {Location, NewComment, NewOffer} from '../../types/types';
import { CreateCommentDto} from '../dtos/commments/index.js';

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
  location: locationToDto(offer.location)
});

export const commentToDto = (comment: NewComment, offerId: string): CreateCommentDto => ({
  offerId,
  text: comment.comment,
  rating: comment.rating,
  publishDate: new Date().toISOString(),
});
