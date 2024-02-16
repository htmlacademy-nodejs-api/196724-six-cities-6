import { Request } from 'express';
import { RequestParams } from '../../../libs/controller/index.js';

export type GetOfferCommentsRequest = Request<RequestParams<{ id: string }>>;
