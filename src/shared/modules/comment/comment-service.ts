import { DocumentType, types } from '@typegoose/typegoose';
import { inject, injectable } from 'inversify';
import { Components } from '../../types/index.js';
import { ILogger } from '../../libs/logger/index.js';
import { ICommentService } from './comment-service.interface.js';
import { CreateCommentDto } from './dtos/index.js';
import { CommentEntity } from './comment.entity.js';

@injectable()
export class CommentService implements ICommentService {
  constructor(
    @inject(Components.CommentModel) private readonly commentModel: types.ModelType<CommentEntity>,
    @inject(Components.Logger) private readonly logger: ILogger,
  ) {}

  public async create(dto: CreateCommentDto): Promise<DocumentType<CommentEntity>> {
    const result = await this.commentModel.create(dto);
    this.logger.info('New comment created!');
    return result;
  }
}
