import { ICategory } from "../../models/category.model";
import { IBaseRepository } from "../IBase.repository";

export interface ICategoryRepository extends IBaseRepository<ICategory> {
    getCategoryByName(name: string): Promise<ICategory | null>;
    getCategoryByNameAndNotId(name: string, id: string): Promise<ICategory | null>;
}
