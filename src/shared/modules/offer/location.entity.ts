import { prop } from '@typegoose/typegoose';

export class LocationEntity {
  @prop({ required: true })
  public long: number;

  @prop({ required: true })
  public lat: number;
}
