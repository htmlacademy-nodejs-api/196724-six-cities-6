import 'reflect-metadata';
import { Container } from 'inversify';
import { IApplication, createApplicationContainer } from './application/index.js';
import { Components } from './shared/types/index.js';
import { createUserContainer } from './shared/modules/user/index.js';
import { createOfferContainer } from './shared/modules/offer/index.js';
import { createCommentContainer } from './shared/modules/comment/index.js';
import {createAuthContainer} from './shared/modules/auth/index.js';

const bootstrap = () => {
  const appContainer = Container.merge(
    createUserContainer(),
    createApplicationContainer(),
    createCommentContainer(),
    createOfferContainer(),
    createAuthContainer()
  );

  const application = appContainer.get<IApplication>(Components.Application);
  application.init();
};

bootstrap();
