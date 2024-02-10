import mongoose from 'mongoose';
import { DocumentType, types } from '@typegoose/typegoose';
import { inject, injectable } from 'inversify';
import { Collections, Components, SortType } from '../../types/index.js';
import { ILogger } from '../../libs/logger/index.js';
import { IOfferService } from './offer-service.interface.js';
import { OfferEntity } from './offer.entity.js';
import { CreateOfferDto, UpdateOfferDto } from './dtos/index.js';
import { MAX_RETRIEVE_OFFERS, MAX_RETRIEVE_PREMIUM_OFFERS } from './offer-service.constants.js';
import {
  addedOfferExtraFields,
  commentsLookupPipeline,
  userFavouritesLookupPipeline
} from './offer-service.pipelines.js';


@injectable()
export class OfferService implements IOfferService {
  constructor(
    @inject(Components.OfferModel) private readonly offerModel: types.ModelType<OfferEntity>,
    @inject(Components.Logger) private readonly logger: ILogger,
  ) {}

  public async create(dto: CreateOfferDto): Promise<DocumentType<OfferEntity>> {
    const result = await (await this.offerModel.create(dto))
      .populate(['userId']);
    this.logger.info(`New offer created: ${result.name}`);
    return result;
  }

  public async update(id: string, dto: UpdateOfferDto): Promise<DocumentType<OfferEntity> | null> {
    const result = await this.offerModel.findByIdAndUpdate(id, dto, {new: true})
      .populate(['userId']).exec();
    this.logger.info(`${dto.name} offer updated.`);
    return result;
  }

  public async delete(id: string): Promise<DocumentType<OfferEntity> | null> {
    const result = await this.offerModel.findByIdAndDelete(id).exec();
    // @TODO 5.3.2 and 5.3.3 not done yet
    this.logger.info(`${result?.name} offer deleted.`);
    return result;
  }

  public async fetch(limit?: number): Promise<DocumentType<OfferEntity>[]> {
    return await this.offerModel.aggregate<DocumentType<OfferEntity>>([
      commentsLookupPipeline,
      addedOfferExtraFields,
      { $unset: Collections.comments },
      { $limit: limit ?? MAX_RETRIEVE_OFFERS },
      { $sort: { postDate: SortType.Down }}
    ]).exec();
  }

  public async findById(id: string): Promise<DocumentType<OfferEntity>> {
    const result: DocumentType<OfferEntity>[] = await this.offerModel.aggregate<DocumentType<OfferEntity>>(
      [
        { $match: { _id: new mongoose.Types.ObjectId(id) } },
        commentsLookupPipeline,
        userFavouritesLookupPipeline,
        addedOfferExtraFields,
        { $addFields: { isFavourite: { $toBool: { $size: '$favourites'} }}},
        { $unset: Collections.comments },
        { $unset: Collections.users },
        { $limit: 1 }
      ]
    ).exec();
    return result[0];
  }

  public fetchPremiumByCity(city: string): Promise<DocumentType<OfferEntity>[]> {
    return this.offerModel.aggregate<DocumentType<OfferEntity>>([
      { $match: { city, isPremium: true } },
      commentsLookupPipeline,
      addedOfferExtraFields,
      { $unset: Collections.comments },
      { $limit: MAX_RETRIEVE_PREMIUM_OFFERS },
      { $sort: { postDate: SortType.Down }}
    ]).exec();
  }

  public fetchFavourites(): Promise<DocumentType<OfferEntity>[]> {
    return this.offerModel.aggregate<DocumentType<OfferEntity>>([
      commentsLookupPipeline,
      userFavouritesLookupPipeline,
      addedOfferExtraFields,
      { $addFields: { isFavourite: { $toBool: { $size: '$favourites'} }}},
      { $match: {isFavourite: true }},
      { $unset: 'isFavourite' },
      { $unset: Collections.comments },
      { $unset: Collections.users },
    ]).exec();
  }
}
