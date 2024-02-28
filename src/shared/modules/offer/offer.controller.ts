import { Controller, HttpMethod } from '../../libs/controller/index.js';
import { inject, injectable } from 'inversify';
import { Components } from '../../types/index.js';
import { ILogger } from '../../libs/logger/index.js';

import { CreateOffersRequestType, GetOffersRequestType, PatchOffersRequestType } from './types/index.js';

import { IOfferService } from './offer-service.interface.js';
import { Request, Response } from 'express';
import { fillDto, isNumber } from '../../utils/index.js';

import { OfferLiteRdo, OfferRdo } from './rdos/index.js';
import { StatusCodes } from 'http-status-codes';
import { GetOfferRequestType } from './types/get-offer-request.type.js';
import { GetPremiumOffersRequest } from './types/get-premium-offers-request.type.js';
import {
  DocumentExistsMiddleware, IMiddleware, PrivateRouteMiddleware,
  ValidateDtoMiddleware,
  ValidateObjectIdMiddleware
} from '../../libs/middleware/index.js';
import { CreateOfferDto, UpdateOfferDto } from './dtos/index.js';
import { createOfferValidator, updateOfferValidator } from './validators/index.js';
import {HttpError} from '../../libs/errors/index.js';

@injectable()
export class OfferController extends Controller {
  private readonly validateObjectIdMiddleware: IMiddleware;
  private readonly documentExistsMiddleware: IMiddleware;
  private readonly privateRouteMiddleware: IMiddleware;
  constructor(
    @inject(Components.Logger) protected readonly logger: ILogger,
    @inject(Components.OfferService) private readonly offerService: IOfferService,
  ) {
    super(logger);
    this.logger.info('Register routes for OfferController ...');

    this.privateRouteMiddleware = new PrivateRouteMiddleware();
    this.validateObjectIdMiddleware = new ValidateObjectIdMiddleware(['id']);
    this.documentExistsMiddleware = new DocumentExistsMiddleware(this.offerService, 'Offer', 'id');

    this.addRoute({ path: '/', method: HttpMethod.Get, handler: this.fetch });
    this.addRoute({ path: '/premium', method: HttpMethod.Get, handler: this.getPremiumByCity });
    this.addRoute({
      path: '/favourites',
      method: HttpMethod.Get,
      handler: this.getFavourites,
      middleware: [ this.privateRouteMiddleware ]
    });

    this.addRoute({
      path: '/delete/:id',
      method: HttpMethod.Delete,
      handler: this.delete ,
      middleware: [
        this.privateRouteMiddleware,
        this.validateObjectIdMiddleware,
        this.documentExistsMiddleware
      ]
    });

    this.addRoute({
      path: '/create',
      method: HttpMethod.Post,
      handler: this.create,
      middleware: [
        this.privateRouteMiddleware,
        new ValidateDtoMiddleware(CreateOfferDto, createOfferValidator)
      ]
    });

    this.addRoute({
      path: '/patch/:id',
      method: HttpMethod.Patch,
      handler: this.patch,
      middleware: [
        this.privateRouteMiddleware,
        this.validateObjectIdMiddleware,
        new ValidateDtoMiddleware(UpdateOfferDto, updateOfferValidator),
        this.documentExistsMiddleware
      ]
    });

    this.addRoute({
      path: '/:id',
      method: HttpMethod.Get,
      handler: this.getById,
      middleware: [this.validateObjectIdMiddleware]
    });
  }

  public async fetch({ query: { limit }, tokenPayload: { id }}: GetOffersRequestType, res: Response) {
    const isValidLimit: boolean = limit ? isNumber(limit) : true;
    if (isValidLimit) {
      const parsedLimit: number | undefined = limit ? Number(limit) : undefined;
      const offers = await this.offerService.fetch(id, parsedLimit);
      if (offers.length) {
        return this.success(res, fillDto(OfferLiteRdo, offers));
      }
      return this.noContent(res, fillDto(OfferLiteRdo, offers));
    }

    throw new HttpError(
      StatusCodes.BAD_REQUEST,
      `Limit ${limit} is not a number.`,
      'OfferController'
    );
  }

  public async getById({ params: { id }}: GetOfferRequestType, res: Response) {
    const offer = await this.offerService.findById(id);
    if (offer) {
      return this.success(res, fillDto(OfferRdo, offer));
    }

    throw new HttpError(
      StatusCodes.NOT_FOUND,
      `Offer with id «${id}» not found.`,
      'OfferController'
    );
  }

  public async getPremiumByCity({ query: { city }}: GetPremiumOffersRequest, res: Response) {

    if(typeof city === 'string') {
      const offers = await this.offerService.fetchPremiumByCity(city.trim());
      if (offers.length) {
        return this.success(res, fillDto(OfferLiteRdo, offers));
      }
      return this.noContent(res, fillDto(OfferLiteRdo, offers));
    }
    throw new HttpError(
      StatusCodes.BAD_REQUEST,
      `Not able to parse city: ${city}.`,
      'OfferController'
    );
  }

  public async getFavourites({ tokenPayload: { id } }: Request, res: Response) {
    const offers = await this.offerService.fetchFavourites(id);
    if (offers.length) {
      return this.success(res, fillDto(OfferLiteRdo, offers));
    }

    return this.noContent(res, fillDto(OfferLiteRdo, offers));
  }

  public async delete({ params: { id } }: GetOffersRequestType, res: Response) {
    if (id) {
      const result = await this.offerService.delete(id);
      return this.success(res, fillDto(OfferRdo, result));
    }

    throw new HttpError(
      StatusCodes.BAD_REQUEST,
      `Not able to read offer id: ${id}.`,
      'OfferController'
    );
  }

  public async create({ body, tokenPayload: { id } }: CreateOffersRequestType, res: Response) {
    const result = await this.offerService.create({ ...body, userId: id });
    return this.created(res, fillDto(OfferRdo, result));
  }

  public async patch({ body, params: { id }}: PatchOffersRequestType, res: Response) {
    if (id) {
      const result = await this.offerService.update(id, body);
      return this.success(res, fillDto(OfferRdo, result));
    }

    throw new HttpError(
      StatusCodes.BAD_REQUEST,
      `Not able to read offer id: ${id}.`,
      'OfferController'
    );
  }
}
