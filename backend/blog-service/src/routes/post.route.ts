import { Router } from "express";
import container from "@/configs/inversify.config";
import { PostController } from "@/controllers/implemetations/post.controller";
import upload from "@/middlewares/multer.middleware";

const postRouter = Router();

const postController = container.get<PostController>(PostController);

postRouter.post('/:userId',upload.single('image'),postController.addPost.bind(postController));
postRouter.get('/',postController.getPosts.bind(postController));
postRouter.get('/:user_id',postController.getPostsByUserId.bind(postController));
postRouter.put('/:blog_id',postController.updatePost.bind(postController));
postRouter.delete('/:blog_id',postController.deletePost.bind(postController));
postRouter.patch('/:blog_id/like',postController.toggleLike.bind(postController));

postRouter.post('/:blog_id/comment',postController.addComment.bind(postController));
postRouter.get('/:blog_id/comment',postController.getComments.bind(postController));
postRouter.patch('/:blog_id/comment/:comment_id',postController.toggleCommentLike.bind(postController));
postRouter.delete('/:blog_id/comment/:comment_id',postController.removeComment.bind(postController));

export default postRouter;