import { DocumentType } from '@typegoose/typegoose';
import { CreateCommentDto } from './dtos/index.js';
import { CommentEntity } from './comment.entity.js';
import { IService } from '../../types/index.js';

export interface ICommentService extends IService{
  create(dto: CreateCommentDto): Promise<DocumentType<CommentEntity>>;
  fetchByOfferId(id: string): Promise<DocumentType<CommentEntity>[]>;
}
