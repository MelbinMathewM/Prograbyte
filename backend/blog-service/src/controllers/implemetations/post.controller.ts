import { inject } from "inversify";
import { IPostController } from "../interfaces/post.controller";
import { PostService } from "@/services/implementations/post.service";
import { Request, Response, NextFunction } from "express";
import { HttpStatus } from "@/constants/status.constant";
import { HttpResponse } from "@/constants/response.constant";

export class PostController implements IPostController {
    constructor(@inject(PostService) private postService : PostService) {}

    async addPost(req: Request, res: Response, next: NextFunction): Promise<void> {
        try{
            const post = req.body;

            const blog = await this.postService.addPost(post);

            res.status(HttpStatus.CREATED).json({ message: HttpResponse.POST_ADDED, blog});
        }catch(err){
            next(err);
        }
    }

    async getPosts(req: Request, res: Response, next: NextFunction): Promise<void> {
        try{
            const blogs = await this.postService.getPosts();

            res.status(HttpStatus.OK).json({blogs});
        }catch(err){
            next(err);
        }
    }

    async getPostsByUserId(req: Request, res: Response, next: NextFunction): Promise<void> {
        try{
            const { user_id } = req.params;

            if(!user_id) {
                res.status(HttpStatus.BAD_REQUEST).json({ error: HttpResponse.USER_ID_REQUIRED});
            }

            const blogs = await this.postService.getPostsByUserId(user_id);

            res.status(HttpStatus.OK).json({ blogs });
        }catch(err){
            throw err;
        }
    }
}