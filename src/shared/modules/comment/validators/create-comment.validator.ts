import Joi from 'joi';
import { CreateCommentDto } from '../dtos/index.js';
import {
  COMMENT_OBJECT_ID_HEX_MAX,
  COMMENT_RATING_MAX,
  COMMENT_RATING_MIN,
  COMMENT_TEXT_MAX,
  COMMENT_TEXT_MIN
} from './comment-constraints.constants.js';

export const createCommentValidator = Joi.object<CreateCommentDto>({
  text: Joi.string().min(COMMENT_TEXT_MIN).max(COMMENT_TEXT_MAX),
  offerId: Joi.string().hex().max(COMMENT_OBJECT_ID_HEX_MAX),
  rating: Joi.number().integer().min(COMMENT_RATING_MIN).max(COMMENT_RATING_MAX),
  publishDate: Joi.string().isoDate()
}).options({ presence: 'required' });
