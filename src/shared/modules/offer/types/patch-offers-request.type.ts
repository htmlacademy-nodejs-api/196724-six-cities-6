import { Request } from 'express';
import { RequestBody, RequestParams } from '../../../libs/controller/index.js';
import { UpdateOfferDto } from '../dtos/index.js';

export type PatchOffersRequestType = Request<RequestParams, RequestBody, UpdateOfferDto>;
