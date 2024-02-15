import { Request } from 'express';
import { RequestBody, RequestParams, RequestQueries, RespondBody } from '../../../libs/controller/index.js';

export type GetPremiumOffersRequest = Request<RequestParams, RespondBody, RequestBody, RequestQueries<{ city: string }>>;
