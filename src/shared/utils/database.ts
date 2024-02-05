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
