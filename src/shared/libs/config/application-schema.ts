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
    doc: 'Database server IP address.',
    format: 'ipaddress',
    env: 'HOST',
    default: null
  },
  SALT: {
    doc: 'Password hush.',
    format: String,
    env: 'SALT',
    default: null
  },
});
