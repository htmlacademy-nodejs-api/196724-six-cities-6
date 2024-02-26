import { PipelineStage } from 'mongoose';
import {Collections, SortType} from '../../types/index.js';

export const commentsLookup: PipelineStage = {
  $lookup: {
    from: Collections.comments,
    let: { offerId: '$_id'},
    pipeline: [
      { $match: { $expr: { $eq: ['$offerId', '$$offerId'] } } },
      { $project: { _id: 1, rating: 1 }}
    ],
    as: 'comments'
  }
};

export const usersLookup: PipelineStage = {
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
};

export const sortPipelineStage: PipelineStage = { $sort: { postDate: SortType.Down }};

export const addCommentsCountAndRatingFields = {
  id: { $toString: '$_id' },
  commentsCount: {$size: '$comments'},
  rating: {
    $cond: [
      {$toBool: {$size: '$comments'}},
      {
        $round: [{
          $avg: {
            $map: {
              input: '$comments',
              as: 'comment',
              in: '$$comment.rating'
            }
          }
        }, 1]
      },
      0
    ]
  }
};
