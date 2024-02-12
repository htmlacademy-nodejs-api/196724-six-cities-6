import { Request } from 'express';
import { RequestBody, RequestParams, RespondBody } from '../../../libs/controller/index.js';

export type GetOffersRequestType = Request<RequestParams, RequestBody, RespondBody>;
