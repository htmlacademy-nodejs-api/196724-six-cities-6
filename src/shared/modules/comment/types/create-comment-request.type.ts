import { Request } from 'express';
import { RequestBody, RequestParams } from '../../../libs/controller/index.js';
import { CreateCommentDto } from '../dtos/index.js';

export type CreateCommentRequest = Request<RequestParams, RequestBody, Omit<CreateCommentDto, 'userId'>>;
