import { Container } from 'inversify';
import { Components } from '../../types/index.js';
import { types } from '@typegoose/typegoose';
import { ICommentService } from './comment-service.interface.js';
import { CommentService } from './comment-service.js';
import { CommentEntity, CommentModel } from './comment.entity.js';

export const createCommentContainer = () => {
  const commentContainer: Container = new Container();
  commentContainer.bind<ICommentService>(Components.CommentService).to(CommentService).inSingletonScope();
  commentContainer.bind<types.ModelType<CommentEntity>>(Components.CommentModel).toConstantValue(CommentModel);
  return commentContainer;
};
