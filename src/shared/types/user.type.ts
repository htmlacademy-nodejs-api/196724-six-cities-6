export enum UserType {
  BASIC = 0,
  PRO = 1
}

export type User = {
  name: string,
  email: string,
  password: string,
  type: UserType,
  avatarUrl?: string
}
