import { Offer, PropertyType } from '../../types/index.js';
import { getModelForClass, prop, modelOptions } from '@typegoose/typegoose';
import {BaseDocument} from '../base-document.js';

@modelOptions({
  schemaOptions: {
    collection: 'offers',
    timestamps: true,
  }
})

export class OfferEntity extends BaseDocument {
  constructor(data: Offer) {
    super();
    this.userId = data.userId;
    this.name = data.name;
    this.description = data.description;
    this.postDate = data.postDate;
    this.city = data.city;
    this.previewUrl = data.previewUrl;
    this.urls = data.urls;
    this.isPremium = data.isPremium;
    this.isFavourite = data.isFavourite;
    this.rating = data.rating;
    this.type = data.type;
    this.bedrooms = data.bedrooms;
    this.guests = data.guests;
    this.facilities = data.facilities;
    // ⚠️ Question. I got an error ("Setting "Mixed" for property "OfferEntity.location"") regarding storing data as an object (Location is { long: string, lat: string }).
    // Do you think is it fine to store it as setting instead?
    this.location = JSON.stringify(data.location);
    this.commentsCount = data.commentsCount;
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

  // ⚠️ Question. I got a warning ('Setting "Mixed" for property "OfferEntity.urls"'). So I found the solution on the Web (type: [String]) https://mongoosejs.com/docs/schematypes.html#arrays.
  // But I am not sure if is it correct way to resolve ot or not?
  // Works for me. The same for other arrays.
  @prop({ type: [String], required: true, default: [] })
  public urls: string[];

  @prop({ required: true, default: false })
  public isPremium: boolean;

  @prop({ required: true, default: false })
  public isFavourite: boolean;

  @prop({ required: true, min: 1, max: 5, default: 1 })
  public rating: number;

  @prop({ required: true, default: PropertyType.apartment })
  public type: string;

  @prop({ required: true, min: 1, max: 8, default: 1 })
  public bedrooms: number;

  @prop({ required: true, min: 1, max: 10, default: 1 })
  public guests: number;

  @prop({ type: [String], required: true, default: [] })
  public facilities: string[];

  @prop({ required: true, default: { long: 0, lat: 0 }})
  public location: string;

  @prop({ default: null })
  public commentsCount?: number;
}

export const OfferModel = getModelForClass(OfferEntity);
