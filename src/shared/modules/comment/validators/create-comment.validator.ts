import Joi from 'joi';
import { CreateCommentDto } from '../dtos/index.js';

export const createCommentValidator = Joi.object<CreateCommentDto>({
  text: Joi.string().min(5).max(1024),
  offerId: Joi.string().hex().max(24),
  userId: Joi.string().hex().max(24),
  rating: Joi.number().integer().min(1).max(5),
  publishDate: Joi.string().isoDate()
}).options({presence: 'required'});
