import { DocumentType, types } from '@typegoose/typegoose';
import { inject, injectable } from 'inversify';
import { Components } from '../../types/index.js';
import { ILogger } from '../../libs/logger/index.js';
import { IOfferService } from './offer-service.interface.js';
import { OfferEntity } from './offer.entity.js';
import { CreateOfferDto } from './create-offer-dto.js';

@injectable()
export class OfferService implements IOfferService {
  constructor(
    @inject(Components.OfferModel) private readonly offerModel: types.ModelType<OfferEntity>,
    @inject(Components.Logger) private readonly logger: ILogger,
  ) {}

  public async create(dto: CreateOfferDto): Promise<DocumentType<OfferEntity>> {
    const offer = new OfferEntity(dto);
    const result = this.offerModel.create(offer);
    this.logger.info(`New offer created: ${offer.name}`);
    return result;
  }
}
