import { Collections, Location, PropertyType } from '../../types/index.js';
import { getModelForClass, prop, modelOptions, Ref } from '@typegoose/typegoose';
import { BaseDocument } from '../base-document.js';
import { UserEntity } from '../user/index.js';

@modelOptions({
  schemaOptions: {
    collection: Collections.offers,
    timestamps: true,
  }
})
export class OfferEntity extends BaseDocument {
  constructor() {
    super();
  }

  @prop({
    ref: UserEntity,
    required: true,
  })
  public userId: Ref<UserEntity>;

  @prop({ required: true })
  public name: string;

  @prop({ required: true })
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

  @prop({ required: true, default: 1 })
  public bedrooms: number;

  @prop({ required: true, default: 1 })
  public guests: number;

  @prop({ type: () => [String], required: true, default: [] })
  public facilities: string[];

  @prop({ required: true, default: undefined, _id: false })
  public location: Location;
}

export const OfferModel = getModelForClass(OfferEntity);
