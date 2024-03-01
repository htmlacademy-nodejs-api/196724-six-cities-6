import Joi from 'joi';
import { CreateOfferDto } from '../dtos/index.js';
import { City, Facility, PropertyType } from '../../../types/index.js';
import {
  OFFER_NAME_MIN,
  OFFER_NAME_MAX,
  OFFER_DESC_MAX,
  OFFER_DESC_MIN,
  OFFER_PRICE_MAX,
  OFFER_PRICE_MIN,
  OFFER_BEDROOMS_MAX,
  OFFER_BEDROOMS_MIN,
  OFFER_GUESTS_MAX,
  OFFER_GUESTS_MIN,
} from './offer-validator-constraints.constants.js';

export const baseOfferValidator = Joi.object<CreateOfferDto>({
  name: Joi.string().min(OFFER_NAME_MIN).max(OFFER_NAME_MAX),
  description: Joi.string().min(OFFER_DESC_MIN).max(OFFER_DESC_MAX),
  postDate: Joi.string().isoDate(),
  city: Joi.string().valid(...Object.keys(City)),
  price: Joi.number().min(OFFER_PRICE_MIN).max(OFFER_PRICE_MAX),
  type: Joi.string().valid(...Object.keys(PropertyType)),
  bedrooms: Joi.number().integer().min(OFFER_BEDROOMS_MIN).max(OFFER_BEDROOMS_MAX),
  guests: Joi.number().integer().min(OFFER_GUESTS_MIN).max(OFFER_GUESTS_MAX),
  facilities: Joi.array().items(Joi.string().valid(...Object.values(Facility))).unique(),
  location: Joi.object({
    long: Joi.number(),
    lat: Joi.number()
  }),
});
