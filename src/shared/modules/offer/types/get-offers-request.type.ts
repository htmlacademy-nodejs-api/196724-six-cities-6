import { Request } from 'express';
import { RequestBody, RequestParams, RequestQueries, RespondBody } from '../../../libs/controller/index.js';

export type GetOffersRequestType = Request<RequestParams, RespondBody, RequestBody, RequestQueries<{ limit: string }>>;
