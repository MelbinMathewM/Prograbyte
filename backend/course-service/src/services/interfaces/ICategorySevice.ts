import { ICategory } from "@/models/categoryModel";

export interface ICategoryService {
    createCategory(category: ICategory): Promise<ICategory>;
    getCategories(): Promise<ICategory[]>;
    updateCategory(id: string, updatedData: Partial<ICategory>): Promise<ICategory>;
    deleteCategory(id: string): Promise<void>;
}
