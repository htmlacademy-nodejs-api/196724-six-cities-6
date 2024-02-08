import { User, UserType } from '../../types/index.js';
import { getModelForClass, prop, modelOptions } from '@typegoose/typegoose';
import { getGeneratedSHA256 } from '../../utils/index.js';
import { BaseDocument } from '../base-document.js';

const VALIDATE_EMAIL_REG_EX = /^([\w-\\.]+@([\w-]+\.)+[\w-]{2,4})?$/;

@modelOptions({
  schemaOptions: {
    collection: 'users',
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
  }

  @prop({ required: true, minlength: 1, maxlength: 15 })
  public name: string;

  @prop({ required: true, unique: true, validate: [VALIDATE_EMAIL_REG_EX, 'Email is incorrect'] })
  public email: string;

  @prop({ required: true, minlength: 6 })
  public password: string;

  @prop({ required: true, default: UserType.BASIC })
  public type: UserType;

  @prop({ required: false, default: null })
  public avatarUrl?: string;

  public setPassword(salt: string) {
    this.password = getGeneratedSHA256(this.password, salt);
  }
}

export const UserModel = getModelForClass(UserEntity);
