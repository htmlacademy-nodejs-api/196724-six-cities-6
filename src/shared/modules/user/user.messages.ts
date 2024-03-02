export class UserMessages {
  static readonly config = 'Some config properties have not been provided.';
  static notFound = (query: string) => `User with «${query}» does not exist.`;
  static exists = (email: string) => `User with email «${email}» exists already.`;
  static new = (name: string) => `New user created: ${name}`;
}
