import { Collections, User, UserType } from '../../types/index.js';
import { getModelForClass, prop, modelOptions } from '@typegoose/typegoose';
import { getGeneratedSHA256 } from '../../utils/index.js';
import { BaseDocument } from '../base-document.js';

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

  @prop({ required: true, default: UserType.BASIC })
  public type: UserType;

  @prop({ required: false, default: undefined })
  public avatarUrl?: string;

  @prop({ type: () => [String], default: undefined })
  public favourites?: string[];

  public setPassword(salt: string) {
    this.password = getGeneratedSHA256(this.password, salt);
  }
}

export const UserModel = getModelForClass(UserEntity);
