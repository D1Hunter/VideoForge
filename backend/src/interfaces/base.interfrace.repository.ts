export interface IBaseRepository<T> {
  create(dto: Object): Promise<T>;
  findOneById(id: string): Promise<T | null>;
  findMany(): Promise<T[]>;
  update(entity: T, dto: Object): Promise<T>;
  delete(id: any): Promise<number>;
}
