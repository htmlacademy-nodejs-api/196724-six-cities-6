export enum UserType {
  BASIC = 'basic',
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
