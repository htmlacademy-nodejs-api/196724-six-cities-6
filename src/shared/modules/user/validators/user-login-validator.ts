import Joi from 'joi';
import { CreateUserDto } from '../dtos/index.js';

export const userLoginValidator = Joi.object<CreateUserDto>({
  name: Joi.string().min(1).max(15),
  email: Joi.string().email(),
}).options({ presence: 'required' });
