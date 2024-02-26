import { ClassConstructor, plainToInstance } from 'class-transformer';
import {Storage} from '../types/index.js';

export const getMongoUrl = (
  args: {
    username: string,
    password: string,
    host: string,
    port: string,
    databaseName: string
  }
): string =>
  `mongodb://${args.username}:${args.password}@${args.host}:${args.port}/${args.databaseName}?authSource=admin`;


export const retryConnection = async (options: {callback: () => Promise<void>, onFailed: () => void, tries: number}): Promise<void> => {
  const { callback, onFailed, tries } = options;
  try {
    return await callback();
  } catch (error) {
    if (tries > 1) {
      onFailed();
      return await retryConnection({ callback, onFailed, tries: tries - 1 });
    } else {
      throw error;
    }
  }
};

export function fillDto<T, V>(someDto: ClassConstructor<T>, plainObject: V) {
  return plainToInstance(someDto, plainObject, { excludeExtraneousValues: true, exposeUnsetFields: false });
}

export function createErrorObject(message: string) {
  return {
    error: message,
  };
}

export const getStorageUrl = (args: {
  host: string,
  port: number,
  storage: Storage,
  fileName?: string
}) => `http://${args.host}:${args.port}${args.storage}/${args.fileName}`;
