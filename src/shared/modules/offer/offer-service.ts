import { DocumentType, types } from '@typegoose/typegoose';
import { inject, injectable } from 'inversify';
import {Collections, Components, SortType} from '../../types/index.js';
import { ILogger } from '../../libs/logger/index.js';
import { IOfferService } from './offer-service.interface.js';
import { OfferEntity } from './offer.entity.js';
import { CreateOfferDto, UpdateOfferDto } from './dtos/index.js';

const MAX_RETRIEVE_OFFERS: number = 60;

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
      { $lookup: {
        from: Collections.comments,
        let: { offerId: '$_id' }, // offer id from offers
        pipeline: [
          { $match: { $expr: { $eq: ['$offerId', '$$offerId'] } } },
          { $project: { _id: 1, rating: 1 }}
        ],
        as: 'comments'
      }},
      { $addFields:
          {
            commentsCount: { $size: '$comments'},
            rating: {
              $avg: {
                $map: {
                  input: '$comments',
                  as: 'comment',
                  in: '$$comment.rating'
                }
              }
            }
          }
      },
      { $unset: Collections.comments },
      { $limit: limit ?? MAX_RETRIEVE_OFFERS },
      { $sort: { postDate: SortType.Down }}
    ]).exec();
  }
}
