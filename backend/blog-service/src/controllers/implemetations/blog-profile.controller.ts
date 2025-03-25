import { HttpResponse } from "@/constants/response.constant";
import { HttpStatus } from "@/constants/status.constant";
import { IBlogProfileController } from "@/controllers/interfaces/IBlog-profile.controller";
import { BlogProfileService } from "@/services/implementations/blog-profile.service";
import { Request, Response, NextFunction } from "express";
import { inject } from "inversify";

export class BlogProfileController implements IBlogProfileController {
    constructor(@inject(BlogProfileService) private blogProfileService: BlogProfileService) { }

    async createBlogUser(userId: string, username: string): Promise<void> {
        await this.blogProfileService.createProfile(userId, username);
    }

    async getProfile(req: Request, res: Response, next: NextFunction): Promise<void> {
        try{
            const { user_id } = req.params;

            if(!user_id){
                res.status(HttpStatus.BAD_REQUEST).json({ error: HttpResponse.USER_ID_REQUIRED});
                return;
            }
            const profile = await this.blogProfileService.getProfile(user_id);

            res.status(HttpStatus.OK).json({profile});
        }catch(err){
            next(err);
        }
    }

    async getProfilePublic(req: Request, res: Response, next: NextFunction): Promise<void> {
        try{
            const { username } = req.params;

            if(!username){
                res.status(HttpStatus.BAD_REQUEST).json({ error: HttpResponse.INVALID_CREDENTIALS });
                return;
            }

            const profile = await this.blogProfileService.getPublicProfile(username);

            res.status(HttpStatus.OK).json({ profile })
        }catch(err){
            next(err);
        }
    }
}