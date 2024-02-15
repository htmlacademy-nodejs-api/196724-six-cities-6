import { Request } from 'express';
import { RequestBody, RequestParams } from '../../../libs/controller/index.js';
import { CreateUserDto } from '../dtos/index.js';


export type CreateUserRequest = Request<RequestParams, RequestBody, CreateUserDto>;
