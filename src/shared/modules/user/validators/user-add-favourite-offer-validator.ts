import Joi from 'joi';
import { UserBaseConstraints } from './user-constraints.enum.js';
import { AddUserFavouriteOfferDto } from '../dtos/index.js';

export const userAddFavouriteOfferValidator = Joi.object<AddUserFavouriteOfferDto>({
  offerId: Joi.string().hex().min(UserBaseConstraints.ObjectIdHexMax).required(),
});
