import { PipelineStage } from 'mongoose';
import { Collections } from '../../types/index.js';

export const commentsLookupPipeline: PipelineStage = {
  $lookup: {
    from: Collections.comments,
    let: { offerId: '$_id' },
    pipeline: [
      { $match: { $expr: { $eq: ['$offerId', '$$offerId'] } } },
      { $project: { _id: 1, rating: 1 }}
    ],
    as: 'comments'
  }
};

export const userFavouritesLookupPipeline: PipelineStage = {
  $lookup: {
    from: Collections.users,
    let: { offerId: '$_id' },
    pipeline: [
      { $match: { $expr: { $in: ['$$offerId', '$favourites'] } } },
      { $project: { _id: 1 }}
    ],
    as: 'favourites'
  }
};

export const addedOfferExtraFields: PipelineStage = {
  $addFields: {
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
};
