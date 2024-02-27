import Joi from 'joi';
import { baseOfferValidator } from './base-offer.validator.js';

export const createOfferValidator = baseOfferValidator.options({presence: 'required'})
  .append({
    isPremium: Joi.boolean().optional()
  });
