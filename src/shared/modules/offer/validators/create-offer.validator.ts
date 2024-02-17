import Joi from 'joi';
import { CreateOfferDto } from '../dtos/index.js';
import { City, Facility, PropertyType } from '../../../types/index.js';

export const createOfferValidator = Joi.object<CreateOfferDto>({
  userId: Joi.string().hex().max(24).required(),
  name: Joi.string().min(10).max(100).required(),
  description: Joi.string().min(20).max(1024).required(),
  postDate: Joi.string().isoDate().required(),
  city: Joi.string().valid(...Object.keys(City)).required(),
  price: Joi.number().min(100).max(100000).required(),
  previewUrl: Joi.string().uri().required(),
  urls: Joi.array().items(Joi.string().uri()).unique().required(),
  type: Joi.string().valid(...Object.keys(PropertyType)).required(),
  bedrooms: Joi.number().integer().min(1).max(8).required(),
  guests: Joi.number().integer().min(1).max(10).required(),
  facilities: Joi.array().items(Joi.string().valid(...Object.keys(Facility))).unique().required(),
  location: Joi.object({
    long: Joi.number().required(),
    lat: Joi.number().required()
  }).required(),
  isPremium: Joi.boolean().optional()
});
