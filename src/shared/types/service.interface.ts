export interface IService {
  exists(id: string): Promise<boolean>;
}
