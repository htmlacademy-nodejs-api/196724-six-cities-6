import { Request } from 'express';
import { RequestBody, RequestParams } from '../../../libs/controller/index.js';
import { AddUserFavouriteOfferDto } from '../dtos/add-user-favourite-offer-dto.js';
export type AddUserFavouriteOfferRequest = Request<RequestParams, RequestBody, AddUserFavouriteOfferDto>;
