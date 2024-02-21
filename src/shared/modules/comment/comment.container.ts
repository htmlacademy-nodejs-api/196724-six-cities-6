import { Container } from 'inversify';
import { Components } from '../../types/index.js';
import { types } from '@typegoose/typegoose';
import { ICommentService } from './comment-service.interface.js';
import { CommentService } from './comment-service.js';
import { CommentEntity, CommentModel } from './comment.entity.js';
import { IController} from '../../libs/controller/index.js';
import { CommentController } from './comment.controller.js';

export const createCommentContainer = () => {
  const commentContainer: Container = new Container();
  commentContainer.bind<ICommentService>(Components.CommentService).to(CommentService).inSingletonScope();
  commentContainer.bind<types.ModelType<CommentEntity>>(Components.CommentModel).toConstantValue(CommentModel);
  commentContainer.bind<IController>(Components.CommentController).to(CommentController).inSingletonScope();
  return commentContainer;
};
