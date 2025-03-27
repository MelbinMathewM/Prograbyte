import { inject } from "inversify";
import { injectable } from "inversify";
import { ICategoryRepository } from "@/repositories/interfaces/ICategory.repository";
import { ICategory } from "@/models/category.model";
import { createHttpError } from "@/utils/http-error.util";
import { HttpStatus } from "@/constants/status.constant";
import { HttpResponse } from "@/constants/response.constant";
import { ICategoryService } from "../interfaces/ICategory.service";

@injectable()
export class CategoryService implements ICategoryService {
    constructor(@inject("ICategoryRepository") private categoryRepository: ICategoryRepository) {}

    async createCategory(category: ICategory): Promise<ICategory> {
    
            const existingCategory = await this.categoryRepository.getCategoryByName(category.name.toLowerCase());
    
            if (existingCategory) throw createHttpError(HttpStatus.CONFLICT, HttpResponse.CATEGORY_EXIST);
    
            const newCategory = await this.categoryRepository.create(category);
    
            if (!newCategory) throw createHttpError(HttpStatus.BAD_REQUEST, HttpResponse.CATEGORY_INSERT_ERROR);
    
            return newCategory;
        }
    
        async getCategories(): Promise<ICategory[]> {
    
            const categories = await this.categoryRepository.findAll();
    
            if (!categories) throw createHttpError(HttpStatus.INTERNAL_SERVER_ERROR, HttpResponse.CATEGORY_FETCH_ERROR);
    
            return categories;
        }
    
        async updateCategory(id: string, updatedData: Partial<ICategory>): Promise<ICategory> {
    
            const existingCategory = await this.categoryRepository.getCategoryByNameAndNotId(updatedData.name?.toLowerCase() as string, id);
    
            if (existingCategory) {
                throw createHttpError(HttpStatus.CONFLICT, HttpResponse.CATEGORY_EXIST);
            }
    
            const updatedCategory = await this.categoryRepository.updateById(id, updatedData);
    
            if (!updatedCategory) {
                throw createHttpError(HttpStatus.BAD_REQUEST, HttpResponse.CATEGORY_UPDATE_ERROR);
            }
    
            return updatedCategory;
        }
    
        async deleteCategory(id: string): Promise<void> {

            const existingCategory = await this.categoryRepository.findById(id);
    
            if (!existingCategory) {
                throw createHttpError(HttpStatus.NOT_FOUND, HttpResponse.CATEGORY_NOT_FOUND);
            }
    
            const deleted = await this.categoryRepository.deleteById(id);
    
            if (!deleted) {
                throw createHttpError(HttpStatus.INTERNAL_SERVER_ERROR, HttpResponse.CATEGORY_DELETE_ERROR);
            }
        }
    
}