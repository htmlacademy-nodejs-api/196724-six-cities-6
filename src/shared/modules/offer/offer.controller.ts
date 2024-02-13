import { Controller, HttpMethod } from '../../libs/controller/index.js';
import { inject, injectable } from 'inversify';
import { Components } from '../../types/index.js';
import { ILogger } from '../../libs/logger/index.js';

import { CreateOffersRequestType, GetOffersRequestType, PatchOffersRequestType } from './types/index.js';

import { IOfferService } from './offer-service.interface.js';
import { Response } from 'express';
import { fillDto, isNumber } from '../../utils/index.js';

import { OfferLiteRdo, OfferRdo } from './rdos/index.js';
import { HttpError } from '../../libs/exeption-filter/index.js';
import { StatusCodes } from 'http-status-codes';

@injectable()
export class OfferController extends Controller {
  constructor(
    @inject(Components.Logger) protected readonly logger: ILogger,
    @inject(Components.OfferService) private readonly offerService: IOfferService,
  ) {
    super(logger);
    this.logger.info('Register routes for OfferController ...');

    this.addRoute({ path: '/', method: HttpMethod.Get, handler: this.getAll });
    this.addRoute({ path: '/premium', method: HttpMethod.Get, handler: this.getPremiumByCity });
    this.addRoute({ path: '/favourites', method: HttpMethod.Get, handler: this.getFavourites });
    this.addRoute({ path: '/delete/:id', method: HttpMethod.Delete, handler: this.delete });
    this.addRoute({ path: '/create', method: HttpMethod.Post, handler: this.create });
    this.addRoute({ path: '/patch/:id', method: HttpMethod.Patch, handler: this.patch });
    this.addRoute({ path: '/:id', method: HttpMethod.Get, handler: this.getById });
  }

  public async getAll(req: GetOffersRequestType, res: Response) {
    const { query: { limit: _limit}} = req;

    const isValidLimit: boolean = _limit ? isNumber(_limit) : true;

    if (isValidLimit) {
      const limit = _limit ? Number(_limit) : undefined;
      const offers = await this.offerService.fetch(limit);
      return this.success(res, fillDto(OfferLiteRdo, offers));
    }

    throw new HttpError(
      StatusCodes.BAD_REQUEST,
      `Limit ${_limit} is not a number.`,
      'OfferController'
    );
  }

  public async getById(req: GetOffersRequestType, res: Response) {
    const { params: { id }} = req;
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

  public async getPremiumByCity(req: GetOffersRequestType, res: Response) {
    const { query: { city}} = req;

    if(typeof city === 'string') {
      const result = await this.offerService.fetchPremiumByCity(city);
      return this.success(res, fillDto(OfferRdo, result));
    }
    throw new HttpError(
      StatusCodes.BAD_REQUEST,
      `Not able to parse city: ${city}.`,
      'OfferController'
    );
  }

  public async getFavourites(_req: GetOffersRequestType, res: Response) {
    const result = await this.offerService.fetchFavourites();
    return this.success(res, fillDto(OfferRdo, result));
  }

  public async delete(req: GetOffersRequestType, res: Response) {
    const { params} = req;

    if (params.id) {
      const result = await this.offerService.delete(params.id);
      return this.success(res, fillDto(OfferRdo, result));
    }

    throw new HttpError(
      StatusCodes.BAD_REQUEST,
      `Not able to read offer id: ${params.id}.`,
      'OfferController'
    );
  }

  public async create(req: CreateOffersRequestType, res: Response) {
    const { body} = req;

    const result = await this.offerService.create(body);
    return this.success(res, fillDto(OfferRdo, result));
  }

  public async patch(req: PatchOffersRequestType, res: Response) {
    const { body, params} = req;


    if (params.id) {
      const result = await this.offerService.update(params.id, body);
      return this.success(res, fillDto(OfferRdo, result));
    }

    throw new HttpError(
      StatusCodes.BAD_REQUEST,
      `Not able to read offer id: ${params.id}.`,
      'OfferController'
    );
  }
}
