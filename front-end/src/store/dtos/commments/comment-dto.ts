import { UserDto } from '../user/index.js';
export class CommentDto{
  public offerId!: string;
  public text!: string;
  public rating!: number;
  public author!: UserDto;
  public publishDate!: string;
}
