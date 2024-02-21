import {getModelForClass, prop, modelOptions, Ref} from '@typegoose/typegoose';
import { BaseDocument } from '../base-document.js';
import { Collections } from '../../types/index.js';
import {OfferEntity} from '../offer/index.js';
import {UserEntity} from '../user/index.js';

@modelOptions({
  schemaOptions: {
    collection: Collections.comments,
    timestamps: true,
  }
})
export class CommentEntity extends BaseDocument {
  constructor() {
    super();
  }

  @prop({
    ref: OfferEntity,
    required: true,
  })
  public offerId: Ref<OfferEntity>;

  @prop({
    ref: UserEntity,
    required: true,
  })
  public userId: Ref<OfferEntity>;

  @prop({ trim: true, required: true })
  public text: string;

  @prop({ required: true })
  public rating: number;

  @prop({ required: true })
  public publishDate: string;
}

export const CommentModel = getModelForClass(CommentEntity);
