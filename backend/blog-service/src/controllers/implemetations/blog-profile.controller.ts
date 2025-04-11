import { HttpResponse } from "@/constants/response.constant";
import { HttpStatus } from "@/constants/status.constant";
import { IBlogProfileController } from "@/controllers/interfaces/IBlog-profile.controller";
import { IBlogProfile } from "@/models/blog-profile.model";
import { BlogProfileService } from "@/services/implementations/blog-profile.service";
import { Request, Response, NextFunction } from "express";
import { inject } from "inversify";

export class BlogProfileController implements IBlogProfileController {
    constructor(@inject(BlogProfileService) private _blogProfileService: BlogProfileService) { }

    async createBlogUser(userId: string, username: string): Promise<void> {
        await this._blogProfileService.createProfile(userId, username);
    }

    async getProfile(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { user_id } = req.params;

            if (!user_id) {
                res.status(HttpStatus.BAD_REQUEST).json({ error: HttpResponse.USER_ID_REQUIRED });
                return;
            }
            const profile = await this._blogProfileService.getProfile(user_id);

            res.status(HttpStatus.OK).json({ profile })
        } catch (err) {
            next(err);
        }
    }

    async updateUsername(username: Partial<IBlogProfile>, userId: string): Promise<void> {
        try{

            if(username && userId){
                await this._blogProfileService.updateUsername(username, userId);
            }
        }catch(err: any){
            console.log(err.message);
        }
    }

    async getProfilePublic(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { username } = req.params;

            if (!username) {
                res.status(HttpStatus.BAD_REQUEST).json({ error: HttpResponse.INVALID_CREDENTIALS });
                return;
            }

            const profile = await this._blogProfileService.getPublicProfile(username);

            res.status(HttpStatus.OK).json({ profile })
        } catch (err) {
            next(err);
        }
    }

    async followUser(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { userId } = req.params;
            const { followerId } = req.body;

            if (userId === followerId) {
                res.status(HttpStatus.BAD_REQUEST).json({ error: HttpResponse.SELF_FOLLOW_ERROR });
            }

            await this._blogProfileService.followUser(userId, followerId);

            res.status(HttpStatus.OK).json({ message: HttpResponse.USER_FOLLOWED})
        } catch (err) {
            next(err);
        }
    }

    async unfollowUser(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { userId } = req.params;
            const { followerId } = req.body;

            if (userId === followerId) {
                res.status(HttpStatus.BAD_REQUEST).json({ error: HttpResponse.SELF_UNFOLLOW_ERROR });
            }

            await this._blogProfileService.unfollowUser(userId, followerId);

            res.status(HttpStatus.OK).json({ message: HttpResponse.USER_UNFOLLOWED})
        } catch (err) {
            next(err);
        }
    }

    async getConversation(req: Request, res: Response, next: NextFunction): Promise<void> {
        try{
            const { user1Id, user2Id } = req.body;

            if (!user1Id || !user2Id) {
                res.status(HttpStatus.BAD_REQUEST).json({ error: HttpResponse.BOTH_USER_IDS_REQUIRED });
                return;
            }

            const conversation = await this._blogProfileService.getConversation(user1Id, user2Id);

            res.status(HttpStatus.OK).json({ conversationId: conversation._id });
        }catch(err){
            next(err);
        }
    }

    async getMutualConnections(req: Request, res: Response, next: NextFunction): Promise<void> {
        try{
            const {userId} = req.params;

            if (!userId) {
                res.status(HttpStatus.BAD_REQUEST).json({ error: HttpResponse.USER_ID_REQUIRED });
                return;
            }

            const users = await this._blogProfileService.getMutualUsers(userId);

            res.status(HttpStatus.OK).json({ users });
        }catch(err){
            next(err);
        }
    }

    async getMessages(req: Request, res: Response, next: NextFunction): Promise<void> {
        console.log('gf')
        try{
            const { conversationId } = req.params;
            const limit = parseInt(req.query.limit as string) || 100;
            console.log(conversationId, 'kk', limit)


            const messages = await this._blogProfileService.getMessages(conversationId,limit);

            res.status(HttpStatus.OK).json({ messages });
        }catch(err){
            next(err);
        }
    }
}