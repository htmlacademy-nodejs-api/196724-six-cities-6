import 'reflect-metadata';
import { Container } from 'inversify';
import { IApplication, createApplicationContainer } from './application/index.js';
import { Components } from './shared/types/index.js';
import { createUserContainer } from './shared/modules/user/index.js';
import { createOfferContainer } from './shared/modules/offer/index.js';
import { createCommentContainer } from './shared/modules/comment/index.js';

const bootstrap = () => {
  const appContainer = Container.merge(
    createApplicationContainer(),
    createUserContainer(),
    createCommentContainer(),
    createOfferContainer(),
  );

  const application = appContainer.get<IApplication>(Components.Application);
  application.init();
};

bootstrap();
