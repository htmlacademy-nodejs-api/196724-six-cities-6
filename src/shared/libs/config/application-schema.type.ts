export type ApplicationSchema = {
  PORT: number;
  HOST: string;
  SALT: string;
  DB_HOST: string;
  DB_PORT: string;
  DB_USER: string;
  DB_PASSWORD: string;
  DB_NAME: string;
  UPLOAD_DIRECTORY: string;
  STATIC_DIRECTORY: string;
  JWT_SECRET: string;
  JWT_EXPIRED: string;
}
