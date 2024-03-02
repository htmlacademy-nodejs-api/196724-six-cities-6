import { CityName, Type} from '../../../types/types.js';
import { LocationDto } from './location-dto.js';

export class CreateOfferDto {
  public name!: string;
  public description!: string;
  public postDate!: string;
  public city!: CityName;
  public price!: number;
  public type!: Type;
  public bedrooms!: number;
  public guests!: number;
  public facilities!: string[];
  public location!: LocationDto;
  public isPremium!: boolean;
  public previewUrl!: string;
  public urls!: string[];
}
