import { Router } from "express";
import { BlogProfileController } from "@/controllers/implemetations/blog-profile.controller";
import container from "@/configs/inversify.config";

const blogProfileRouter = Router();

const blogProfileController = container.get<BlogProfileController>(BlogProfileController);

blogProfileRouter.get("/:user_id", blogProfileController.getProfile.bind(blogProfileController));
blogProfileRouter.get("/public/:username", blogProfileController.getProfilePublic.bind(blogProfileController));
blogProfileRouter.post('/:userId/follow', blogProfileController.followUser.bind(blogProfileController));
blogProfileRouter.post('/:userId/unfollow', blogProfileController.unfollowUser.bind(blogProfileController));
blogProfileRouter.post('/chat/conversation', blogProfileController.getConversation.bind(blogProfileController));
blogProfileRouter.get('/:userId/mutual-follow', blogProfileController.getMutualConnections.bind(blogProfileController));
blogProfileRouter.get('/chat/conversation/:conversationId', blogProfileController.getMessages.bind(blogProfileController));

export default blogProfileRouter;