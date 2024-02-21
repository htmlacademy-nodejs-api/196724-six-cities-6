import { DocumentType } from '@typegoose/typegoose';
import { CreateOfferDto, UpdateOfferDto } from './dtos/index.js';
import { OfferEntity } from './offer.entity.js';
import { IService } from '../../types/index.js';

export interface IOfferService extends IService{
  create(dto: CreateOfferDto): Promise<DocumentType<OfferEntity>>;
  update(userId: string, dto: UpdateOfferDto): Promise<DocumentType<OfferEntity> | null>;
  delete(id: string): Promise<DocumentType<OfferEntity> | null>;
  fetch(limit?: number): Promise<DocumentType<OfferEntity>[]>;
  fetchPremiumByCity(city: string): Promise<DocumentType<OfferEntity>[]>;
  fetchFavourites(): Promise<DocumentType<OfferEntity>[]>;
  findById(id: string): Promise<DocumentType<OfferEntity> | null>;
}
