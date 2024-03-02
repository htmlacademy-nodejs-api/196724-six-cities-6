export enum UserType {
  Basic = 'basic',
  Pro = 'pro'
}

export type User = {
  name: string,
  email: string,
  password: string,
  type: UserType,
  avatarUrl?: string,
  favourites?: string[],
}
