import { InversifyContainer } from './shared/libs/inversify-container/index.js';

const container = new InversifyContainer();
const bootstrap = () => {
  container.initMainApplicationContainers();
  container.application.init();
};

bootstrap();
