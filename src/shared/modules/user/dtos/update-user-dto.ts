import { UserType } from '../../../types/index.js';

export class UpdateUserDto {
  public name?: string;
  public type?: UserType;
  public avatarUrl?: string;
}
