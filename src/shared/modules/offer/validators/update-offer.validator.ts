import Joi from 'joi';
import { UpdateOfferDto } from '../dtos/index.js';
import { City, PropertyType, Facility } from '../../../types/index.js';

export const updateOfferValidator = Joi.object<UpdateOfferDto>({
  name: Joi.string().min(10).max(100),
  description: Joi.string().min(20).max(1024),
  postDate: Joi.string().isoDate(),
  city: Joi.string().valid(...Object.keys(City)),
  price: Joi.number().min(100).max(100000),
  previewUrl: Joi.string().uri(),
  urls: Joi.array().items(Joi.string().uri()).unique(),
  type: Joi.string().valid(...Object.keys(PropertyType)),
  bedrooms: Joi.number().integer().min(1).max(8),
  guests: Joi.number().integer().min(1).max(10),
  facilities: Joi.array().items(Joi.string().valid(...Object.keys(Facility))).unique(),
  location: Joi.object({
    long: Joi.number(),
    lat: Joi.number()
  }),
  isPremium: Joi.boolean()
}).options({presence: 'optional'});
