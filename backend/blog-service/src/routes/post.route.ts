import { Router } from "express";
import container from "@/configs/inversify.config";
import { PostController } from "@/controllers/implemetations/post.controller";

const postRouter = Router();

const postController = container.get<PostController>(PostController);

postRouter.post('/',postController.addPost.bind(postController));
postRouter.get('/',postController.getPosts.bind(postController));
postRouter.get('/:user_id',postController.getPostsByUserId.bind(postController));
postRouter.put('/:blog_id')

export default postRouter;