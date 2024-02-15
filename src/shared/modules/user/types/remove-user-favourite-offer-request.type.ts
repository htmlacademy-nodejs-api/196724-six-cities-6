import { Request } from 'express';
import { RequestParams } from '../../../libs/controller/index.js';

export type RemoveUserFavouriteOfferRequest = Request<RequestParams<{ id: string, offerId: string }>>;
