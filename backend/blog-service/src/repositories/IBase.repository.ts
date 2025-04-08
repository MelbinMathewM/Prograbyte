import { FilterQuery, UpdateQuery, Document } from "mongoose";

export interface IBaseRepository<T extends Document> {
  create(data: Partial<T>): Promise<T>;
  findById(id: string): Promise<T | null>;
  findOne(filter: FilterQuery<T>): Promise<T | null>;
  find(filter?: FilterQuery<T>): Promise<T[]>;
  update(id: string, data: UpdateQuery<T>): Promise<T | null>;
  updateMany(filter: FilterQuery<T>, data: UpdateQuery<T>, options?: object): Promise<void>
  delete(id: string): Promise<T | null>;
  count(filter?: FilterQuery<T>): Promise<number>;
  populate(filter: FilterQuery<T>, populateFields: string | string[]): Promise<T[]>;
  populateOne(filter: FilterQuery<T>, populateFields: string | any): Promise<T | null>;
  save(document: T): Promise<T>;
}
