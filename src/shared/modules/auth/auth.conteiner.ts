import { Container } from 'inversify';
import { IAuthService } from './auth-service.interface.js';
import { Components } from '../../types/index.js';
import { AuthService } from './auth-service.js';

export const createAuthContainer = () => {
  const authContainer = new Container();
  authContainer.bind<IAuthService>(Components.AuthService).to(AuthService).inSingletonScope();

  return authContainer;
};
