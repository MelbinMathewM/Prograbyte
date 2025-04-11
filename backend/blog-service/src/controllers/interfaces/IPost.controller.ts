import { IBlogProfile } from "@/models/blog-profile.model";
import { NextFunction, Request, Response } from "express";

export interface IPostController {
    addPost(req: Request, res: Response, next: NextFunction): Promise<void>;
    getPosts(req: Request, res: Response, next: NextFunction): Promise<void>;
    getPostsByUserId(req: Request, res: Response, next: NextFunction): Promise<void>;
    updatePost(req: Request, res: Response, next: NextFunction): Promise<void>;
    deletePost(req: Request, res: Response, next: NextFunction): Promise<void>;
    updatePostUsername(userData: Partial<IBlogProfile>, userId: string): Promise<void>;
    toggleLike(req: Request, res: Response, next: NextFunction): Promise<void>;
    addComment(req: Request, res: Response, next: NextFunction): Promise<void>;
    editComment(req: Request, res: Response, next: NextFunction): Promise<void>;
    getComments(req: Request, res: Response, next: NextFunction): Promise<void>;
    removeComment(req: Request, res: Response, next: NextFunction): Promise<void>;
    toggleCommentLike(req: Request, res: Response, next: NextFunction): Promise<void>;
    addSubComment(req: Request, res: Response, next: NextFunction): Promise<void>;
    toggleSubCommentLike(req: Request, res: Response, next: NextFunction): Promise<void>;
    removeSubComment(req: Request, res: Response, next: NextFunction): Promise<void>;
}