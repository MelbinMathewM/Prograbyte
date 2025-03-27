import { Router } from "express";
import container from "@/configs/inversify.config";
import { CategoryController } from "@/controllers/implementations/category.controller";

const categoryRouter = Router();

const categoryController = container.get<CategoryController>(CategoryController);

// Category routes
categoryRouter.post("/", categoryController.createCategory.bind(categoryController));
categoryRouter.get("/", categoryController.getCategories.bind(categoryController));
categoryRouter.put("/:id", categoryController.updateCategory.bind(categoryController));
categoryRouter.delete("/:id", categoryController.deleteCategory.bind(categoryController));

export default categoryRouter;
