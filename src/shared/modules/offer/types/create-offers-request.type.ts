import { Request } from 'express';
import { RequestBody, RequestParams } from '../../../libs/controller/index.js';
import { CreateOfferDto } from '../dtos/index.js';

export type CreateOffersRequestType = Request<RequestParams, RequestBody, Omit<CreateOfferDto, 'userId'>>;
