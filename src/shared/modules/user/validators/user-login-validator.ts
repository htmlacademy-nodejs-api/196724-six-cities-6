import Joi from 'joi';
import { CreateUserDto } from '../dtos/index.js';
import { UserPasswordConstraints } from './user-constraints.enum.js';

export const userLoginValidator = Joi.object<CreateUserDto>({
  password: Joi.string().min(UserPasswordConstraints.Min).max(UserPasswordConstraints.Max).required(),
  email: Joi.string().email(),
}).options({ presence: 'required' });
