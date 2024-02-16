import { Request } from 'express';
import { RequestBody, RequestParams } from '../../../libs/controller/index.js';
import { LoginUserDto } from '../dtos/index.js';


export type LoginUserRequest = Request<RequestParams, RequestBody, LoginUserDto>;
