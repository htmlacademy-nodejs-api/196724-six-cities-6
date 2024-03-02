import { Expose, Type } from 'class-transformer';
import { User } from '../../../types/index.js';
import { UserRdo } from '../../user/index.js';
export class CommentRdo {
  @Expose()
  public offerId: string;

  @Expose()
  public text: string;

  @Expose()
  public rating: number;

  @Expose({ name: 'userId'})
  @Type(() => UserRdo)
  public author: User;

  @Expose()
  public publishDate: string;
}
