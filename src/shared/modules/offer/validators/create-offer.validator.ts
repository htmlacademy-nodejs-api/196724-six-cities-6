import Joi from 'joi';
import { baseOfferValidator } from './base-offer.validator.js';

export const createOfferValidator = baseOfferValidator.options({presence: 'required'})
  .append({
    userId: Joi.string().hex().max(24).required(),
    isPremium: Joi.boolean().optional()
  });
