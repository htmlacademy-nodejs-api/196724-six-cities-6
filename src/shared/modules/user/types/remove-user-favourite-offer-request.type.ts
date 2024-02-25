import { Request } from 'express';
import { RequestParams } from '../../../libs/controller/index.js';

export type RemoveUserFavouriteOfferRequest = Request<RequestParams<{ offerId: string }>>;
