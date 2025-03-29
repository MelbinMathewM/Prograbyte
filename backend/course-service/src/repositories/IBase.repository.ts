import { FilterQuery } from "mongoose";

export interface IBaseRepository<T> {
    create(data: Partial<T>): Promise<T>;
    findAll(filter?: object): Promise<T[]>;
    findOne(filter: FilterQuery<T>): Promise<T | null>;
    findById(id: string): Promise<T | null>;
    updateById(id: string, updatedData: Partial<T>): Promise<T | null>;
    deleteById(id: string): Promise<boolean>;
    save(document: T): Promise<T>;
}
