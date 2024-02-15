import { Request } from 'express';
import { RequestBody, RequestParams, RespondBody } from '../../../libs/controller/index.js';

export type GetOfferRequestType = Request<RequestParams<{id: string}>, RespondBody, RequestBody>;
