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
  addCommentsCountAndRatingFields,
  commentsLookup,
  sortPipelineStage,
  usersLookup
} from './offer-service.pipelines.js';
import { CommentEntity } from '../comment/index.js';
import { UserEntity } from '../user/index.js';
import {OfferMessages} from './offer.messages.js';


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
    this.logger.info(OfferMessages.new(result.name));
    return result;
  }

  public async update(id: string, dto: UpdateOfferDto): Promise<DocumentType<OfferEntity> | null> {
    const result = await this.offerModel.findByIdAndUpdate(id, dto, {new: true})
      .populate(['userId']).exec();
    if (result) {
      this.logger.info(OfferMessages.updated(result.name));
    } else {
      this.logger.info(OfferMessages.notFound(id));
    }
    return result;
  }

  public async delete(id: string): Promise<DocumentType<OfferEntity> | null> {
    const result = await this.offerModel.findByIdAndDelete(id).exec();
    await this.commentModel.deleteMany({ offerId: id }).exec();
    await this.userModel.updateMany(undefined, { $unset: { favourites: id } }).exec();
    if (result) {
      this.logger.info(OfferMessages.deleted(result.name));
    } else {
      this.logger.info(OfferMessages.notFound(id));
    }
    return result;
  }

  public async fetch(userId?: string, limit?: number): Promise<DocumentType<OfferEntity>[]> {
    return await this.offerModel.aggregate<DocumentType<OfferEntity>>([
      commentsLookup,
      {
        $lookup: {
          from: Collections.users,
          let: { offerId: '$_id' },
          pipeline: [
            { $match: { $expr: { $eq: [{ $convert: { input: '$_id', to: 'string' } }, userId] } } },
            { $match: { $expr: { $in: [{ $convert: { input: '$$offerId', to: 'string' } }, '$favourites'] } } },
          ],
          as: 'favourites'
        }
      },
      {
        $addFields: {
          ...addCommentsCountAndRatingFields,
          isFavourite: userId ? { $toBool: { $size: '$favourites'} } : false
        }
      },
      { $limit: limit ?? MAX_RETRIEVE_OFFERS },
      sortPipelineStage
    ]).exec();
  }

  public async findById(id: string): Promise<DocumentType<OfferEntity>> {
    const [offer]: DocumentType<OfferEntity>[] = await this.offerModel.aggregate<DocumentType<OfferEntity>>(
      [
        { $match: { _id: new mongoose.Types.ObjectId(id) } },
        commentsLookup,
        usersLookup,
        {
          $addFields: {
            ...addCommentsCountAndRatingFields,
            isFavourite: { $toBool: { $size: '$favourites'} }
          }
        },
        sortPipelineStage,
        { $limit: 1 }
      ]
    ).exec();
    return this.offerModel.populate(offer, { path: 'userId' });
  }

  public fetchPremiumByCity(city: string): Promise<DocumentType<OfferEntity>[]> {
    return this.offerModel.aggregate<DocumentType<OfferEntity>>([
      { $match: { $expr: { $eq: [ {$toLower: '$city'}, city.toLowerCase() ] } } },
      { $match: { isPremium: true }},
      commentsLookup,
      usersLookup,
      {
        $addFields: {
          ...addCommentsCountAndRatingFields,
          isFavourite: { $toBool: { $size: '$favourites'} }
        }
      },
      { $sort: { postDate: SortType.Down }},
      { $limit: MAX_RETRIEVE_PREMIUM_OFFERS },
    ]).exec();
  }


  public fetchFavourites(userId: string): Promise<DocumentType<OfferEntity>[]> {
    return this.offerModel.aggregate<DocumentType<OfferEntity>>([
      commentsLookup,
      usersLookup,
      {
        $addFields: {
          ...addCommentsCountAndRatingFields,
          isFavourite: { $toBool: { $size: '$favourites'} }
        }
      },
      { $match: { $expr: { $eq: [ {$toString: '$userId'}, userId ] } } },
      { $match: { isFavourite: true }},
      sortPipelineStage,
    ]).exec();
  }

  public async exists(id: string): Promise<boolean> {
    return !!(await this.offerModel.exists({_id: new mongoose.Types.ObjectId(id)}));
  }
}
