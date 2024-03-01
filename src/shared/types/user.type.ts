export enum UserType {
  REGULAR = 'regular',
  PRO = 'pro'
}

export type User = {
  name: string,
  email: string,
  password: string,
  type: UserType,
  avatarUrl?: string,
  favourites?: string[],
}
