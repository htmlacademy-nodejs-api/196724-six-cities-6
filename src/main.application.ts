import { InversifyContainer } from './shared/libs/inversify-container/index.js';

const container = new InversifyContainer();
const bootstrap = () => {
  container.initMainApplication();
  container.application.init();
};

bootstrap();
