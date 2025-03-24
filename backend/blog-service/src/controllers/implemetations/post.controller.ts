import { inject } from "inversify";
import { IPostController } from "../interfaces/IPost.controller";
import { PostService } from "@/services/implementations/post.service";
import { Request, Response, NextFunction } from "express";
import { HttpStatus } from "@/constants/status.constant";
import { HttpResponse } from "@/constants/response.constant";
import { uploadToCloudinary } from "@/utils/cloudinary.util";

export class PostController implements IPostController {
    constructor(@inject(PostService) private postService: PostService) { }

    async addPost(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const post = req.body;
            const { userId } = req.params;

            let imageUrl = '';
            if (req.file) {
                imageUrl = await uploadToCloudinary(req.file.buffer);
            }

            const blog = await this.postService.addPost({ ...post, image: imageUrl }, userId);

            res.status(HttpStatus.CREATED).json({ message: HttpResponse.POST_ADDED, blog });
        } catch (err) {
            next(err);
        }
    }

    async getPosts(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const blogs = await this.postService.getPosts();

            res.status(HttpStatus.OK).json({ blogs });
        } catch (err) {
            next(err);
        }
    }

    async getPostsByUserId(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { user_id } = req.params;

            if (!user_id) {
                res.status(HttpStatus.BAD_REQUEST).json({ error: HttpResponse.USER_ID_REQUIRED });
                return;
            }

            const blogs = await this.postService.getPostsByUserId(user_id);

            res.status(HttpStatus.OK).json({ blogs });
        } catch (err) {
            next(err);
        }
    }

    async updatePost(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { blog_id } = req.params;
            const updateData = req.body;

            if (!blog_id) {
                res.status(HttpStatus.BAD_REQUEST).json({ message: HttpResponse.BLOG_ID_REQUIRED });
                return;
            }

            const updatedBlog = await this.postService.updatePost(blog_id, updateData);

            res.status(HttpStatus.OK).json({ message: HttpResponse.POST_UPDATED, updatedBlog });
        } catch (err) {
            next(err);
        }
    }

    async deletePost(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { blog_id } = req.params;

            if (!blog_id) {
                res.status(HttpStatus.BAD_REQUEST).json({ message: HttpResponse.BLOG_ID_REQUIRED });
                return;
            }

            await this.postService.deletePost(blog_id);

            res.status(HttpStatus.OK).json({ message: HttpResponse.POST_DELETED });
        } catch (err) {
            next(err);
        }
    }

    async toggleLike(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { blog_id } = req.params;

            if (!blog_id) {
                res.status(HttpStatus.BAD_REQUEST).json({ message: HttpResponse.BLOG_ID_REQUIRED });
                return;
            }

            const { userId } = req.body;

            if (!userId) {
                res.status(HttpStatus.BAD_REQUEST).json({ message: HttpResponse.USER_ID_REQUIRED });
                return;
            }

            await this.postService.toggleLike(blog_id, userId);

            res.status(HttpStatus.OK).json({ message: HttpResponse.LIKE_UPDATED })
        } catch (err) {
            next(err);
        }
    }

    async addComment(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { blog_id } = req.params;

            if (!blog_id) {
                res.status(HttpStatus.BAD_REQUEST).json({ message: HttpResponse.BLOG_ID_REQUIRED });
                return;
            }

            const { userId, content, username } = req.body;

            const newComment = await this.postService.addComment(blog_id, userId, content, username);

            res.status(HttpStatus.CREATED).json({ message: HttpResponse.COMMENT_ADDED, comments: newComment });
        } catch (err) {
            next(err);
        }
    }

    async getComments(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { blog_id } = req.params;

            if (!blog_id) {
                res.status(HttpStatus.BAD_REQUEST).json({ message: HttpResponse.BLOG_ID_REQUIRED });
                return;
            }

            const comment = await this.postService.getComments(blog_id);

            res.status(HttpStatus.OK).json({ comments: comment?.comments });
        } catch (err) {
            next(err);
        }
    }

    async removeComment(req: Request, res: Response, next: NextFunction): Promise<void> {
        const { blog_id, comment_id } = req.params;

        if (!blog_id) {
            res.status(HttpStatus.BAD_REQUEST).json({ message: HttpResponse.BLOG_ID_REQUIRED });
            return;
        }

        if (!comment_id) {
            res.status(HttpStatus.BAD_REQUEST).json({ message: HttpResponse.COMMENT_ID_REQUIRED });
            return;
        }

        await this.postService.deleteComment(blog_id, comment_id);

        res.status(HttpStatus.OK).json({ message: HttpResponse.COMMENT_REMOVED });
    }

    async toggleCommentLike(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { blog_id, comment_id } = req.params;
            const { userId } = req.body;

            if (!blog_id) {
                res.status(HttpStatus.BAD_REQUEST).json({ message: HttpResponse.BLOG_ID_REQUIRED });
                return;
            }

            if (!comment_id) {
                res.status(HttpStatus.BAD_REQUEST).json({ message: HttpResponse.COMMENT_ID_REQUIRED });
                return;
            }

            if (!userId) {
                res.status(HttpStatus.BAD_REQUEST).json({ message: HttpResponse.USER_ID_REQUIRED });
                return;
            }

            await this.postService.toggleCommentLike(blog_id, comment_id, userId);

            res.status(HttpStatus.OK).json(HttpResponse.LIKE_UPDATED);
        } catch (err) {
            next(err);
        }
    }
}