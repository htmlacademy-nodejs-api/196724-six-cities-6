import { Expose, Type } from 'class-transformer';
import { UserType } from '../../../types/index.js';
import { UserRdo } from '../../user/index.js';
export class CommentRdo {
  @Expose()
  public id: string;

  @Expose()
  public text: string;

  @Expose()
  public rating: number;

  @Expose({ name: 'userId'})
  @Type(() => UserRdo)
  public author: UserType;

  @Expose()
  public publishDate: string;
}
