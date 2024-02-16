import mongoose from 'mongoose';
import { DocumentType, types } from '@typegoose/typegoose';
import { inject, injectable } from 'inversify';
import { Components, SortType } from '../../types/index.js';
import { ILogger } from '../../libs/logger/index.js';
import { IOfferService } from './offer-service.interface.js';
import { OfferEntity } from './offer.entity.js';
import { CreateOfferDto, UpdateOfferDto } from './dtos/index.js';
import { MAX_RETRIEVE_OFFERS, MAX_RETRIEVE_PREMIUM_OFFERS } from './offer-service.constants.js';
import { addedOfferExtraFields, lookupPipelines } from './offer-service.pipelines.js';
import { CommentEntity } from '../comment/index.js';
import { UserEntity } from '../user/index.js';


@injectable()
export class OfferService implements IOfferService {
  constructor(
    @inject(Components.OfferModel) private readonly offerModel: types.ModelType<OfferEntity>,
    @inject(Components.CommentModel) private readonly commentModel: types.ModelType<CommentEntity>,
    @inject(Components.UserModel) private readonly userModel: types.ModelType<UserEntity>,
    @inject(Components.Logger) private readonly logger: ILogger,
  ) {}

  public async create(dto: CreateOfferDto): Promise<DocumentType<OfferEntity>> {
    const result = await this.offerModel.create(dto);
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
    await this.commentModel.deleteMany({ offerId: id }).exec();
    await this.userModel.updateMany(undefined, { $unset: { favourites: id } }).exec();
    this.logger.info(`${result?.name} offer deleted.`);
    return result;
  }

  public async fetch(limit?: number): Promise<DocumentType<OfferEntity>[]> {
    return await this.offerModel.aggregate<DocumentType<OfferEntity>>([
      ...lookupPipelines,
      addedOfferExtraFields,
      { $unset: [
        'comments',
        'favorites',
        'description',
        'location',
        'userId',
        'urls',
        'bedrooms',
        'guests',
        'facilities'
      ] },
      { $limit: limit ?? MAX_RETRIEVE_OFFERS },
      { $sort: { postDate: SortType.Down }}
    ]).exec();
  }

  public async findById(id: string): Promise<DocumentType<OfferEntity>> {
    const result: DocumentType<OfferEntity>[] = await this.offerModel.aggregate<DocumentType<OfferEntity>>(
      [
        { $match: { _id: new mongoose.Types.ObjectId(id) } },
        ...lookupPipelines,
        addedOfferExtraFields,
        { $unset: ['comments', 'favorites'] },
        { $sort: { postDate: SortType.Down }},
        { $limit: 1 }
      ]
    ).exec();
    return result[0];
  }

  public fetchPremiumByCity(city: string): Promise<DocumentType<OfferEntity>[]> {
    return this.offerModel.aggregate<DocumentType<OfferEntity>>([
      { $match: { city, isPremium: true } },
      ...lookupPipelines,
      addedOfferExtraFields,
      { $unset: ['comments', 'favorites'] },
      { $sort: { postDate: SortType.Down }},
      { $limit: MAX_RETRIEVE_PREMIUM_OFFERS },
    ]).exec();
  }


  public fetchFavourites(): Promise<DocumentType<OfferEntity>[]> {
    return this.offerModel.aggregate<DocumentType<OfferEntity>>([
      ...lookupPipelines,
      addedOfferExtraFields,
      { $addFields: { isFavourite: { $toBool: { $size: '$favourites'} }}},
      { $match: { isFavourite: true }},
      { $unset: ['comments', 'favorites'] },
      { $sort: { postDate: SortType.Down }},
    ]).exec();
  }

  public async exists(id: string): Promise<boolean> {
    return !!(await this.offerModel.exists({_id: new mongoose.Types.ObjectId(id)}));
  }
}
