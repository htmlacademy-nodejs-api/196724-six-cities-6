import Joi from 'joi';
import { CreateCommentDto } from '../dtos/index.js';
import { CommentTextConstraints, CommentRatingConstraints, CommentCommonConstraints } from './comment-constraints.enum.js';

export const createCommentValidator = Joi.object<CreateCommentDto>({
  text: Joi.string().min(CommentTextConstraints.Min).max(CommentTextConstraints.Max),
  offerId: Joi.string().hex().max(CommentCommonConstraints.ObjectIdHexMax),
  rating: Joi.number().integer().min(CommentRatingConstraints.Min).max(CommentRatingConstraints.Max),
  publishDate: Joi.string().isoDate()
}).options({ presence: 'required' });
