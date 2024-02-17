import Joi from 'joi';
import { CreateUserDto } from '../dtos/index.js';

export const userCreateValidator = Joi.object<CreateUserDto>({
  name: Joi.string().min(1).max(15).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).max(12).required(),
  type: Joi.string().valid('pro', 'basic').required(),
  avatarUrl: Joi.string().uri().optional()
});
