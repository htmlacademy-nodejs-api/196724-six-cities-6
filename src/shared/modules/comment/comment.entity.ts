import { getModelForClass, prop, modelOptions } from '@typegoose/typegoose';
import { BaseDocument } from '../base-document.js';
import { Collections } from '../../types/index.js';

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

  @prop({ type: String })
  public offerId: string;

  @prop({ type: String })

  public userId: string;

  @prop({ trim: true, required: true })
  public text: string;

  @prop({ required: true })
  public rating: number;

  @prop({ required: true })
  public publishDate: string;
}

export const CommentModel = getModelForClass(CommentEntity);
