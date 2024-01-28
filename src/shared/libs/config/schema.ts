import convict from 'convict';
import validator from 'convict-format-with-validator';

convict.addFormats(validator);

export type ApplicationSchema = {
  PORT: number;
  HOST: string;
  SALT: string;
}

export const configRestSchema = convict<ApplicationSchema>({
  PORT: {
    doc: 'Local connection port.',
    format: 'port',
    env: 'PORT',
    default: 4000
  },
  HOST: {
    doc: 'Database server IP address.',
    format: 'ipaddress',
    env: 'HOST',
    default: '127.0.0.4'
  },
  SALT: {
    doc: 'Password hush.',
    format: String,
    env: 'SALT',
    default: null
  },
});
