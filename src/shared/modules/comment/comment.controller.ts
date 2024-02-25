import { Controller, HttpMethod } from '../../libs/controller/index.js';
import { inject, injectable } from 'inversify';
import { Components } from '../../types/index.js';
import { ILogger } from '../../libs/logger/index.js';
import { Response } from 'express';
import { fillDto } from '../../utils/index.js';
import { CommentRdo } from './rdos/index.js';
import { GetOfferCommentsRequest } from './types/index.js';
import { HttpError } from '../../libs/exeption-filter/index.js';
import { StatusCodes } from 'http-status-codes';
import { IOfferService } from '../offer/index.js';
import { ICommentService } from './comment-service.interface.js';
import { CreateCommentRequest } from './types/create-comment-request.type.js';
import {
  PrivateRouteMiddleware,
  ValidateDtoMiddleware,
  ValidateObjectIdMiddleware
} from '../../libs/middleware/index.js';
import { CreateCommentDto } from './dtos/index.js';
import { createCommentValidator } from './validators/index.js';

@injectable()
export class CommentController extends Controller {
  private readonly validateObjectIdMiddleware: ValidateObjectIdMiddleware = new ValidateObjectIdMiddleware(['id']);

  constructor(
    @inject(Components.Logger) protected readonly logger: ILogger,
    @inject(Components.CommentService) private readonly commentService: ICommentService,
    @inject(Components.OfferService) private readonly offerService: IOfferService,
  ) {
    super(logger);
    this.logger.info('Register routes for CommentController ...');

    this.addRoute({
      path: '/offers/create',
      method: HttpMethod.Post,
      handler: this.create,
      middleware: [
        new PrivateRouteMiddleware(),
        new ValidateDtoMiddleware(CreateCommentDto, createCommentValidator)
      ]
    });

    this.addRoute({
      path: '/offers/:id',
      method: HttpMethod.Get,
      handler: this.fetchByOfferId ,
      middleware: [this.validateObjectIdMiddleware]
    });
  }

  public async create(req: CreateCommentRequest, res: Response) {
    const { body, tokenPayload} = req;
    const { id} = tokenPayload;
    const isOfferExist = await this.offerService.exists(body.offerId);
    if (isOfferExist) {
      const result = await this.commentService.create({...body, userId: id});
      return this.created(res, fillDto(CommentRdo, result));
    }

    throw new HttpError(
      StatusCodes.BAD_REQUEST,
      `Offer with id «${body.offerId}» does not exist.`,
      'CommentController'
    );
  }

  public async fetchByOfferId(req: GetOfferCommentsRequest, res: Response) {
    const { id } = req.params;
    const result = await this.commentService.fetchByOfferId(id);

    if (result.length) {
      return this.success(res, fillDto(CommentRdo, result));
    }

    throw new HttpError(
      StatusCodes.NO_CONTENT,
      `Offer with id «${id}»  does not have any comments.`,
      'CommentController'
    );
  }
}
