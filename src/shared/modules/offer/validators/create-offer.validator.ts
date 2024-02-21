import Joi from 'joi';
import { baseOfferValidator } from './base-offer.validator.js';
import { OFFER_OBJECT_ID_HEX_MAX } from './offer-validator-constraints.constants.js';

export const createOfferValidator = baseOfferValidator.options({presence: 'required'})
  .append({
    userId: Joi.string().hex().max(OFFER_OBJECT_ID_HEX_MAX).required(),
    isPremium: Joi.boolean().optional()
  });
