import Joi from 'joi';
import { USER_OBJECT_ID_HEX_MAX } from './user-constraints.constants.js';
import {AddUserFavouriteOfferDto} from '../dtos/add-user-favourite-offer-dto.js';

export const userAddFavouriteOfferValidator = Joi.object<AddUserFavouriteOfferDto>({
  offerId: Joi.string().hex().min(USER_OBJECT_ID_HEX_MAX).required(),
});
