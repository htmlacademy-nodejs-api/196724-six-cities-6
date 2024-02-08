export const Components = {
  CliApplication: Symbol.for('CliApplication'),
  Application: Symbol.for('Application'),
  Logger: Symbol.for('Logger'),
  ConsoleLogger: Symbol.for('ConsoleLogger'),
  ImportCommand: Symbol.for('ImportCommand'),
  HelpCommand: Symbol.for('HelpCommand'),
  VersionCommand: Symbol.for('VersionCommand'),
  GenerateCommand: Symbol.for('GenerateCommand'),
  Config: Symbol.for('Config'),
  DatabaseClient: Symbol.for('DatabaseClient'),
  UserService: Symbol.for('UserService'),
  UserModel: Symbol.for('UserModel'),
  OfferService: Symbol.for('OfferService'),
  OfferModel: Symbol.for('OfferModel')
} as const;
