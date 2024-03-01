import { UserType } from '../../../const.js';

export class UserDto {
  public id!: string;
  public name!: string;
  public email!: string;
  public type!: UserType;
  public favourites!: string[];
  public avatarUrl!: string;
}
