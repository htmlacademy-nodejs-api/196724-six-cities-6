import { Request} from 'express';
import { RequestBody, RequestParams, RequestQueries, RespondBody } from '../../../libs/controller/index.js';
import { TokenPayload} from './token-paylod.type.js';

export type AuthRequest = Request<RequestParams, RequestBody, RespondBody, RequestQueries, TokenPayload>;
