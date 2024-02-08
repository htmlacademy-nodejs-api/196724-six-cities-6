import {Location, PropertyType} from '../../types/index.js';
import { getModelForClass, prop, modelOptions } from '@typegoose/typegoose';
import { BaseDocument } from '../base-document.js';
import { CreateOfferDto } from './create-offer-dto.js';

@modelOptions({
  schemaOptions: {
    collection: 'offers',
    timestamps: true,
  }
})
export class OfferEntity extends BaseDocument {
  constructor(data: CreateOfferDto) {
    super();
    this.userId = data.userId;
    this.name = data.name;
    this.description = data.description;
    this.postDate = data.postDate;
    this.city = data.city;
    this.previewUrl = data.previewUrl;
    this.urls = data.urls;
    this.isPremium = data.isPremium;
    this.type = data.type;
    this.bedrooms = data.bedrooms;
    this.guests = data.guests;
    this.facilities = data.facilities;
    this.location = data.location;
  }

  @prop({ required: true })
  public userId: string;

  @prop({ required: true, minlength: 10, maxlength: 100 })
  public name: string;

  @prop({ required: true, minlength: 20, maxlength: 1024 })
  public description: string;

  @prop({ required: true })
  public postDate: string;

  @prop({ required: true })
  public city: string;

  @prop({ required: true })
  public previewUrl: string;

  @prop({ type: () => [String], required: true, default: [] })
  public urls: string[];

  @prop({ required: true, default: false })
  public isPremium: boolean;

  @prop({ required: true, default: PropertyType.apartment })
  public type: string;

  @prop({ required: true, min: 1, max: 8, default: 1 })
  public bedrooms: number;

  @prop({ required: true, min: 1, max: 10, default: 1 })
  public guests: number;

  @prop({ type: () => [String], required: true, default: [] })
  public facilities: string[];

  @prop({ type: () => Object, required: true, default: null})
  public location: Location;
}

export const OfferModel = getModelForClass(OfferEntity);
