import Joi from 'joi';
import { CreateOfferDto } from '../dtos/index.js';
import { City, Facility, PropertyType } from '../../../types/index.js';
import { OfferBedroomsConstraints, OfferDescConstraints, OfferGuestsConstraints, OfferNameConstraints, OfferPriceConstraints } from './offer-constraints.enum.js';

export const baseOfferValidator = Joi.object<CreateOfferDto>({
  name: Joi.string().min(OfferNameConstraints.Min).max(OfferNameConstraints.Max),
  description: Joi.string().min(OfferDescConstraints.Min).max(OfferDescConstraints.Max),
  postDate: Joi.string().isoDate(),
  city: Joi.string().valid(...Object.keys(City)),
  price: Joi.number().min(OfferPriceConstraints.Min).max(OfferPriceConstraints.Max),
  type: Joi.string().valid(...Object.keys(PropertyType)),
  bedrooms: Joi.number().integer().min(OfferBedroomsConstraints.Min).max(OfferBedroomsConstraints.Max),
  guests: Joi.number().integer().min(OfferGuestsConstraints.Min).max(OfferGuestsConstraints.Max),
  facilities: Joi.array().items(Joi.string().valid(...Object.values(Facility))).unique(),
  location: Joi.object({
    long: Joi.number(),
    lat: Joi.number()
  }),
});
