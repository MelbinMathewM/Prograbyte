import { Router } from "express";
import container from "@/configs/inversify.config";
import { PostController } from "@/controllers/implemetations/post.controller";
import upload from "@/middlewares/multer.middleware";

const postRouter = Router();

const postController = container.get<PostController>(PostController);

postRouter.post('/',upload.single('image'),postController.addPost.bind(postController));
postRouter.get('/',postController.getPosts.bind(postController));
postRouter.get('/:user_id',postController.getPostsByUserId.bind(postController));
postRouter.put('/:blog_id',postController.updatePost.bind(postController));
postRouter.delete('/:blog_id',postController.deletePost.bind(postController));
postRouter.patch('/:blog_id/like',postController.toggleLike.bind(postController));

postRouter.post('/:blog_id/comment',postController.addComment.bind(postController));
postRouter.get('/:blog_id/comment',postController.getComments.bind(postController));
postRouter.put('/:blog_id/comment/:comment_id',postController.editComment.bind(postController));
postRouter.delete('/:blog_id/comment/:comment_id',postController.removeComment.bind(postController));
postRouter.patch('/:blog_id/comment/:comment_id/like',postController.toggleCommentLike.bind(postController));

postRouter.post('/:blog_id/comment/:comment_id',postController.addSubComment.bind(postController));
postRouter.delete('/:blog_id/comment/:comment_id/sub-comment/:sub_comment_id',postController.removeSubComment.bind(postController));
postRouter.patch('/:blog_id/comment/:comment_id/sub-comment/:sub_comment_id/like',postController.toggleSubCommentLike.bind(postController));

export default postRouter;