import { DocumentType } from '@typegoose/typegoose';
import { UserEntity } from './user.entity.js';
import { LoginUserDto, CreateUserDto } from './dtos/index.js';
import { IService } from '../../types/index.js';

export interface IUserService extends IService{
  create(dto: CreateUserDto): Promise<DocumentType<UserEntity>>;
  findById(id: string): Promise<DocumentType<UserEntity> | null>;
  findByEmail(email: string): Promise<DocumentType<UserEntity> | null>;
  login(dto: LoginUserDto): Promise<DocumentType<UserEntity> | null>;
  check(): Promise<DocumentType<UserEntity> | null>;
  addFavouriteOffer(id: string, offerId: string): Promise<DocumentType<UserEntity> | null>;
  removeFavouriteOffer(id: string, offerId: string): Promise<DocumentType<UserEntity> | null>;
}
