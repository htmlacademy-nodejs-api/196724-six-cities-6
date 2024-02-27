import convict from 'convict';
import validator from 'convict-format-with-validator';
import { ApplicationSchema } from './application-schema.type.js';

convict.addFormats(validator);

export const configApplicationSchema = convict<ApplicationSchema>({
  PORT: {
    doc: 'Local connection port.',
    format: 'port',
    env: 'PORT',
    default: null
  },
  HOST: {
    doc: 'Local host name.',
    format: String,
    env: 'HOST',
    default: null
  },
  SALT: {
    doc: 'Password hush.',
    format: String,
    env: 'SALT',
    default: null
  },
  DB_HOST: {
    doc: 'Database host.',
    format: 'ipaddress',
    env: 'DB_HOST',
    default: null
  },
  DB_PORT: {
    doc: 'Database port.',
    format: 'port',
    env: 'DB_PORT',
    default: null
  },
  DB_USER: {
    doc: 'Database user name.',
    format: String,
    env: 'DB_USER',
    default: null
  },
  DB_PASSWORD: {
    doc: 'Database user password.',
    format: String,
    env: 'DB_PASSWORD',
    default: null
  },
  DB_NAME: {
    doc: 'Database name.',
    format: String,
    env: 'DB_NAME',
    default: null
  },
  UPLOAD_DIRECTORY: {
    doc: 'Directory for upload files',
    format: String,
    env: 'UPLOAD_DIRECTORY',
    default: null
  },
  STATIC_DIRECTORY: {
    doc: 'Directory for static files',
    format: String,
    env: 'STATIC_DIRECTORY',
    default: null
  },
  JWT_SECRET: {
    doc: 'JWT secret',
    format: String,
    env: 'JWT_SECRET',
    default: null
  },
  JWT_EXPIRED: {
    doc: 'JWT expired time',
    format: String,
    env: 'JWT_EXPIRED',
    default: null
  },
});
