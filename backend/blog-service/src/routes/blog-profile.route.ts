import { Router } from "express";
import { BlogProfileController } from "@/controllers/implemetations/blog-profile.controller";
import container from "@/configs/inversify.config";

const blogProfileRouter = Router();

const blogProfileController = container.get<BlogProfileController>(BlogProfileController);

blogProfileRouter.get("/:user_id", blogProfileController.getProfile.bind(blogProfileController));
blogProfileRouter.get("/public/:username", blogProfileController.getProfilePublic.bind(blogProfileController));

export default blogProfileRouter;