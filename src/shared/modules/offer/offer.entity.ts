import { Collections, PropertyType } from '../../types/index.js';
import { getModelForClass, prop, modelOptions, Ref } from '@typegoose/typegoose';
import { BaseDocument } from '../base-document.js';
import { CreateLocation } from './dtos/index.js';
import { UserEntity } from '../user/index.js';

@modelOptions({
  schemaOptions: {
    collection: Collections.offers,
    timestamps: true,
  }
})
export class OfferEntity extends BaseDocument {
  @prop({
    ref: UserEntity,
    required: true,
  })
  public userId: Ref<UserEntity>;

  @prop({ required: true, minlength: 10, maxlength: 100 })
  public name: string;

  @prop({ required: true, minlength: 20, maxlength: 1024 })
  public description: string;

  @prop({ required: true })
  public postDate: string;

  @prop({ required: true })
  public city: string;

  @prop({ required: true })
  public price: number;

  @prop({ required: true })
  public previewUrl: string;

  @prop({ type: () => [String], required: true, default: [] })
  public urls: string[];

  @prop({ default: false })
  public isPremium?: boolean;

  @prop({ required: true, default: PropertyType.apartment })
  public type: string;

  @prop({ required: true, min: 1, max: 8, default: 1 })
  public bedrooms: number;

  @prop({ required: true, min: 1, max: 10, default: 1 })
  public guests: number;

  @prop({ min: 1, max: 5, default: 0 })
  public rating: number;

  @prop({ type: () => [String], required: true, default: [] })
  public facilities: string[];

  // @TODO does not work
  @prop({ type: () => CreateLocation, required: true, default: null})
  public location: CreateLocation;
}

export const OfferModel = getModelForClass(OfferEntity);
