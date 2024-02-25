import { Request } from 'express';
import { RequestBody, RequestParams } from '../../../libs/controller/index.js';
import { AddUserFavouriteOfferDto } from '../dtos/index.js';

export type AddUserFavouriteOfferRequest = Request<RequestParams, RequestBody, AddUserFavouriteOfferDto>;
