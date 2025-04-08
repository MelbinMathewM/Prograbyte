import { NextFunction, Request, Response } from "express";

export interface IUserController {
    registerUser(req: Request, res: Response, next: NextFunction): Promise<void>;
    registerTutor(req: Request, res: Response, next: NextFunction): Promise<void>;
    googleAuthCallback(req: Request, res: Response, next: NextFunction): Promise<void>;
    getUser(req: Request, res: Response, next: NextFunction): Promise<void>;
    verifyEmailLink(req: Request, res: Response, next: NextFunction): Promise<void>;
    verifyEmail(req: Request, res: Response, next: NextFunction): Promise<void>;
    getUserById(req: Request, res: Response, next: NextFunction): Promise<void>;
    getProfile(req: Request, res: Response, next: NextFunction): Promise<void>;
    updateProfile(req: Request, res: Response, next: NextFunction): Promise<void>;
    addSkill(req: Request, res: Response, next: NextFunction): Promise<void>;
    editSkill(req: Request, res: Response, next: NextFunction): Promise<void>;
    deleteSkill(req: Request, res: Response, next: NextFunction): Promise<void>;
    createCheckoutSession(req: Request, res: Response): Promise<void>;
    stripeWebhook(req: Request, res: Response): Promise<void>
}