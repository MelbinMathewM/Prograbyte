import { IBlogProfile } from "@/models/blog-profile.model";
import { Request, Response, NextFunction } from "express";

export interface IBlogProfileController {
    createBlogUser(userId: string, username: string): Promise<void>;
    getProfile(req: Request, res: Response, next: NextFunction): Promise<void>;
    updateUsername(username: Partial<IBlogProfile>, userId: string): Promise<void>;
    getProfilePublic(req: Request, res: Response, next: NextFunction): Promise<void>;
    followUser(req: Request, res: Response, next: NextFunction): Promise<void>;
    unfollowUser(req: Request, res: Response, next: NextFunction): Promise<void>;
    getConversation(req: Request, res: Response, next: NextFunction): Promise<void>;
    getMutualConnections(req: Request, res: Response, next: NextFunction): Promise<void>;
    getMessages(req: Request, res: Response, next: NextFunction): Promise<void>;
}