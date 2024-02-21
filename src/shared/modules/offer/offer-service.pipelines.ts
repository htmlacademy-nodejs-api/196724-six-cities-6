import { PipelineStage } from 'mongoose';
import { Collections } from '../../types/index.js';

export const lookupPipelines: PipelineStage[] = [
  {
    $lookup: {
      from: Collections.comments,
      let: { offerId: '$_id'},
      pipeline: [
        { $match: { $expr: { $eq: ['$offerId', '$$offerId'] } } },
        { $project: { _id: 1, rating: 1 }}
      ],
      as: 'comments'
    }
  },
  {
    $lookup: {
      from: Collections.users,
      let: { offerId: '$_id' },
      pipeline: [
        { $match: { favourites: { $exists : true } } },
        { $match: { $expr: { $in: [{ $convert: { input: '$$offerId', to: 'string' } }, '$favourites'] } } },
        { $project: { _id: 1 }}
      ],
      as: 'favourites'
    }
  }
];

export const addedOfferExtraFields: PipelineStage = {
  $addFields: {
    id: { $toString: '$_id' },
    commentsCount: { $size: '$comments'},
    rating: {
      $cond: [
        { $toBool: {$size: '$comments'} },
        { $round: [{
          $avg: {
            $map: {
              input: '$comments',
              as: 'comment',
              in: '$$comment.rating'
            }
          }
        }, 1]},
        0
      ],

    },
    isFavourite: { $toBool: { $size: '$favourites'} }
  }
};
