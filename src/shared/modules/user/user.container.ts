import { Container } from 'inversify';
import { IUserService } from './user-service.interface.js';
import { Components } from '../../types/index.js';
import { UserService } from './user-service.js';
import { types } from '@typegoose/typegoose';
import { UserEntity, UserModel } from './user.entity.js';
import { IController } from '../../libs/controller/index.js';
import { UserController } from './user.controller.js';

export const createUserContainer = () => {
  const userContainer: Container = new Container();
  userContainer.bind<IUserService>(Components.UserService).to(UserService).inSingletonScope();
  userContainer.bind<types.ModelType<UserEntity>>(Components.UserModel).toConstantValue(UserModel);
  userContainer.bind<IController>(Components.UserController).to(UserController).inSingletonScope();
  return userContainer;
};
