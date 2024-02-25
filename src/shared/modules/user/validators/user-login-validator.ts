import Joi from 'joi';
import { CreateUserDto } from '../dtos/index.js';
import { USER_PASSWORD_MIN, USER_PASSWORD_MAX } from './user-constraints.constants.js';

export const userLoginValidator = Joi.object<CreateUserDto>({
  password: Joi.string().min(USER_PASSWORD_MIN).max(USER_PASSWORD_MAX).required(),
  email: Joi.string().email(),
}).options({ presence: 'required' });
