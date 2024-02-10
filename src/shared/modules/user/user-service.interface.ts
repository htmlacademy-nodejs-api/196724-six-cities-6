import { DocumentType } from '@typegoose/typegoose';
import { UserEntity } from './user.entity.js';
import { LoginUserDto, CreateUserDto } from './dtos/index.js';

export interface IUserService {
  create(dto: CreateUserDto, salt: string | undefined): Promise<DocumentType<UserEntity>>;
  findById(id: string): Promise<DocumentType<UserEntity> | null>;
  login(dto: LoginUserDto): Promise<string>;
  check(): Promise<DocumentType<UserEntity> | null>;
  addFavouriteOffer(id: string, offerId: string): Promise<DocumentType<UserEntity> | null>;
  removeFavouriteOffer(id: string, offerId: string): Promise<DocumentType<UserEntity> | null>;
}
