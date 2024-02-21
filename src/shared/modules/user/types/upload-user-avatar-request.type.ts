import { Request } from 'express';
import { RequestParams } from '../../../libs/controller/index.js';

export type UploadUserAvatarRequest = Request<RequestParams<{ id: string }>>;
