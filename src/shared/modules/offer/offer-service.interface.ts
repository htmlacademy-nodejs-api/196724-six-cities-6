import { DocumentType } from '@typegoose/typegoose';
import { CreateOfferDto } from './create-offer-dto.interface.js';
import { OfferEntity } from './offer.entity.js';

export interface IOfferService {
  create(dto: CreateOfferDto): Promise<DocumentType<OfferEntity>>;
}