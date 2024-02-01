export interface IConfig<T> {
  get<U extends keyof T>(key: U): T[U]
}
