import { NextFunction, Request, Response } from "express";

export interface IPostController {
    addPost(req: Request, res: Response, next: NextFunction): Promise<void>;
    getPosts(req: Request, res: Response, next: NextFunction): Promise<void>;
    getPostsByUserId(req: Request, res: Response, next: NextFunction): Promise<void>;
}