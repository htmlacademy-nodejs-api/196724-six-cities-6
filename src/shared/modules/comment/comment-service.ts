import { DocumentType, types } from '@typegoose/typegoose';
import { inject, injectable } from 'inversify';
import { Components, SortType } from '../../types/index.js';
import { ILogger } from '../../libs/logger/index.js';
import { ICommentService } from './comment-service.interface.js';
import { CreateCommentDto } from './dtos/index.js';
import { CommentEntity } from './comment.entity.js';
import { MAX_RETRIEVE_COMMENTS } from './comment-service.constants.js';
import mongoose from 'mongoose';

@injectable()
export class CommentService implements ICommentService {
  constructor(
    @inject(Components.CommentModel) private readonly commentModel: types.ModelType<CommentEntity>,
    @inject(Components.Logger) private readonly logger: ILogger,
  ) {}

  public async create(dto: CreateCommentDto): Promise<DocumentType<CommentEntity>> {
    const result: DocumentType<CommentEntity> = await this.commentModel.create(dto);
    this.logger.info('New comment created!');
    return result;
  }

  public fetchByOfferId(id: string): Promise<DocumentType<CommentEntity>[]> {
    return this.commentModel.find(
      { offerId: id },
      null,
      { limit: MAX_RETRIEVE_COMMENTS, sort: { publishDate: SortType.Down }, _id: true });
  }

  public async exists(id: string): Promise<boolean> {
    return !!(await this.commentModel.exists({_id: new mongoose.Types.ObjectId(id)}));
  }
}
