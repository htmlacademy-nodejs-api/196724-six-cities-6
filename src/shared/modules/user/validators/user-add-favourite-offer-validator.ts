import Joi from 'joi';
import { AddUserFavouriteOfferDto } from '../dtos/add-user-favourite-offer-dto.js';

export const userAddFavouriteOfferValidator = Joi.object<AddUserFavouriteOfferDto>({
  offerId: Joi.string().hex().min(24).required(),
});
