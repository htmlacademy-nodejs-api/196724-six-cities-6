import Joi from 'joi';
import { CreateUserDto } from '../dtos/index.js';
import { USER_NAME_MIN, USER_NAME_MAX, USER_PASSWORD_MIN, USER_PASSWORD_MAX } from './user-constraints.constants.js';
import { UserType } from '../../../types/index.js';

export const userCreateValidator = Joi.object<CreateUserDto>({
  name: Joi.string().min(USER_NAME_MIN).max(USER_NAME_MAX).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(USER_PASSWORD_MIN).max(USER_PASSWORD_MAX).required(),
  type: Joi.string().valid(UserType.PRO, UserType.REGULAR).required(),
  avatarUrl: Joi.string().uri().optional()
});
