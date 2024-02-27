import { Expose } from 'class-transformer';

export class LoginUserRdo {
  @Expose()
  public accessToken: string;
}
