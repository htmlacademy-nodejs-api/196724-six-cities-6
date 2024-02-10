import { DocumentType } from '@typegoose/typegoose';
import { CreateCommentDto } from './dtos/index.js';
import { CommentEntity } from './comment.entity.js';

export interface ICommentService {
  create(dto: CreateCommentDto): Promise<DocumentType<CommentEntity>>;
  fetchByOfferId(id: string): Promise<DocumentType<CommentEntity>[]>;
}
