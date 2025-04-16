import { HttpResponse } from "@/constants/response.constant";
import { HttpStatus } from "@/constants/status.constant";
import { ICategory } from "@/models/category.model";
import { CategoryService } from "@/services/implementations/category.service";
import { NextFunction, Request, Response } from "express";
import { inject } from "inversify";
import { ICategoryController } from "../interfaces/ICategory.controller";

export class CategoryController implements ICategoryController {
    constructor(@inject(CategoryService) private _categoryService: CategoryService) { }

    async createCategory(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
          const category: ICategory = req.body;
    
          const newCategory = await this._categoryService.createCategory(category);
    
          res.status(HttpStatus.CREATED).json({ message: HttpResponse.CATEGORY_ADDED, newCategory });
        } catch (err) {
          next(err)
        }
      };
    
      async getCategories(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
          const categories = await this._categoryService.getCategories();
    
          res.status(HttpStatus.OK).json({categories});
        } catch (err) {
          next(err)
        }
      }
    
      async updateCategory(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
          const { id } = req.params;
          const updatedData: Partial<ICategory> = req.body;
    
          await this._categoryService.updateCategory(id, updatedData);
    
          res.status(HttpStatus.OK).json({ message: HttpResponse.CATEGORY_UPDATED });
        } catch (err) {
          next(err);
        }
      }
    
      async deleteCategory(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
          const { id } = req.params;
    
          await this._categoryService.deleteCategory(id);
    
          res.status(HttpStatus.OK).json({ message: HttpResponse.CATEGORY_DELETED });
        } catch (err) {
          next(err);
        }
      }
}
  