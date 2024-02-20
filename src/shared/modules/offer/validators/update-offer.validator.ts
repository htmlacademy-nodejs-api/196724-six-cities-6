import Joi from 'joi';
import { baseOfferValidator } from './base-offer.validator.js';

export const updateOfferValidator = baseOfferValidator.options({ presence: 'optional' })
  .append({
    isPremium: Joi.boolean().optional()
  });
