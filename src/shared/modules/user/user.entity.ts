import { Collections, User, UserType } from '../../types/index.js';
import { getModelForClass, prop, modelOptions } from '@typegoose/typegoose';
import { BaseDocument } from '../base-document.js';
import { DefaultFiles } from '../../libs/transformer/index.js';

@modelOptions({
  schemaOptions: {
    collection: Collections.users,
    timestamps: true,
  }
})
export class UserEntity extends BaseDocument {
  constructor(data: User) {
    super();
    this.name = data.name;
    this.email = data.email;
    this.type = data.type;
    this.avatarUrl = data.avatarUrl;
    this.password = data.password;
    this.favourites = data.favourites;
  }

  @prop({ required: true })
  public name: string;

  @prop({ required: true, unique: true })
  public email: string;

  @prop({ required: true })
  public password: string;

  @prop({ required: true, default: UserType.Basic })
  public type: UserType;

  @prop({ required: false, default: DefaultFiles.Avatar })
  public avatarUrl?: string;

  @prop({ type: () => [String], default: [] })
  public favourites?: string[];

  public setPassword(password: string) {
    this.password = password;
  }
}

export const UserModel = getModelForClass(UserEntity);
