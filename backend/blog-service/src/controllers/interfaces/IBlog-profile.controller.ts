import { Request, Response, NextFunction } from "express";

export interface IBlogProfileController {
    createBlogUser(userId: string, username: string): Promise<void>;
    getProfile(req: Request, res: Response, next: NextFunction): Promise<void>;
    getProfilePublic(req: Request, res: Response, next: NextFunction): Promise<void>;
}