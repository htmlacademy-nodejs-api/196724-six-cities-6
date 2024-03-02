import { LocationDto, OfferDto, OfferLiteDto } from '../dtos/index.js';
import { Comment, LightOffer, Location, Offer, Type } from '../../types/types.js';
import { CommentDto } from '../dtos/commments/index.js';

const locationToClient = (dto: LocationDto): Location => ({latitude: dto.lat, longitude: dto.long});
export const lightOfferToClient = (dto: OfferLiteDto): LightOffer => ({
  ...dto,
  previewImage: dto.previewUrl,
  city: { name: dto.city, location: locationToClient(dto.location) },
  location: locationToClient(dto.location),
  title: dto.name,
  isFavorite: dto.isFavourite,
  type: dto.type as Type,
});

export const offerToClient = (dto: OfferDto): Offer => ({
  ...dto,
  previewImage: dto.previewUrl,
  city: { name: dto.city, location: locationToClient(dto.location) },
  location: locationToClient(dto.location),
  title: dto.name,
  isFavorite: dto.isFavourite,
  type: dto.type as Type,
  goods: dto.facilities,
  host: dto.author,
  maxAdults: dto.guests,
  images: dto.urls
});

export const commentToClient = (dto: CommentDto): Comment => ({
  id: dto.offerId,
  comment: dto.text,
  rating: dto.rating,
  date: dto.publishDate,
  user: dto.author
});
