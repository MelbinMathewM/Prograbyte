import { NextFunction, Request, Response } from "express";

export interface IPostController {
    addPost(req: Request, res: Response, next: NextFunction): Promise<void>;
    getPosts(req: Request, res: Response, next: NextFunction): Promise<void>;
    getPostsByUserId(req: Request, res: Response, next: NextFunction): Promise<void>;
    updatePost(req: Request, res: Response, next: NextFunction): Promise<void>;
    deletePost(req: Request, res: Response, next: NextFunction): Promise<void>;
    toggleLike(req: Request, res: Response, next: NextFunction): Promise<void>;
    addComment(req: Request, res: Response, next: NextFunction): Promise<void>;
    getComments(req: Request, res: Response, next: NextFunction): Promise<void>;
    removeComment(req: Request, res: Response, next: NextFunction): Promise<void>;
    toggleCommentLike(req: Request, res: Response, next: NextFunction): Promise<void>;
}