import { Request } from 'express';
import {RequestBody, RequestParams} from '../../../libs/controller/index.js';

export type RemoveUserFavouriteOfferRequest = Request<RequestParams, RequestBody>;
