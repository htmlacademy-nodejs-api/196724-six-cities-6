import Joi from 'joi';
import { CreateUserDto } from '../dtos/index.js';
import { UserNameConstraints, UserPasswordConstraints} from './user-constraints.enum.js';
import { UserType } from '../../../types/index.js';

export const userCreateValidator = Joi.object<CreateUserDto>({
  name: Joi.string().min(UserNameConstraints.Min).max(UserNameConstraints.Max).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(UserPasswordConstraints.Min).max(UserPasswordConstraints.Max).required(),
  type: Joi.string().valid(UserType.Pro, UserType.Basic).required(),
  avatarUrl: Joi.string().uri().optional()
});
