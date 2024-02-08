import { DocumentType } from '@typegoose/typegoose';
import { CreateUserDto } from './create-user-dto.js';
import { UserEntity } from './user.entity.js';

export interface IUserService {
  create(dto: CreateUserDto, salt: string | undefined): Promise<DocumentType<UserEntity>>;
  findById(id: string): Promise<DocumentType<UserEntity> | null>;
}
