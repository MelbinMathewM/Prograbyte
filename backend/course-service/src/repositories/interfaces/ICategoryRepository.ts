import { ICategory } from "../../models/categoryModel";
import { IBaseRepository } from "../IBaseRepository";

export interface ICategoryRepository extends IBaseRepository<ICategory> {
    getCategoryByName(name: string): Promise<ICategory | null>;
    getCategoryByNameAndNotId(name: string, id: string): Promise<ICategory | null>;
}
