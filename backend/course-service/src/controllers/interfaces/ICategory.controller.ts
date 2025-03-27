import { NextFunction, Request, Response } from "express";

export interface ICategoryController {
  createCategory(req: Request, res: Response, next: NextFunction): Promise<void>;
  getCategories(req: Request, res: Response, next: NextFunction): Promise<void>;
  updateCategory(req: Request, res: Response, next: NextFunction): Promise<void>;
  deleteCategory(req: Request, res: Response, next: NextFunction): Promise<void>;
}
