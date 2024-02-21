import Joi from 'joi';
import { CreateUserDto } from '../dtos/index.js';
import { USER_NAME_MIN, USER_NAME_MAX } from './user-constraints.constants.js';

export const userLoginValidator = Joi.object<CreateUserDto>({
  name: Joi.string().min(USER_NAME_MIN).max(USER_NAME_MAX),
  email: Joi.string().email(),
}).options({ presence: 'required' });
