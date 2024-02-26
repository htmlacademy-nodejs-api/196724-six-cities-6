import { Container } from 'inversify';
import { Components } from '../../types/index.js';
import { types } from '@typegoose/typegoose';
import { IOfferService } from './offer-service.interface.js';
import { OfferService } from './offer-service.js';
import { OfferEntity, OfferModel } from './offer.entity.js';

export const createOfferContainer = () => {
  const offerContainer: Container = new Container();
  offerContainer.bind<IOfferService>(Components.OfferService).to(OfferService).inSingletonScope();
  offerContainer.bind<types.ModelType<OfferEntity>>(Components.OfferModel).toConstantValue(OfferModel);
  return offerContainer;
};
