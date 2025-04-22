import { inject, injectable } from "inversify";
import { IBlogProfileService } from "../interfaces/IBlog-profile.service";
import { IBlogProfileRepository } from "@/repositories/interfaces/IBlog-profile.repository";
import { IBlogProfile, IMutualFollower } from "@/models/blog-profile.model";
import { createHttpError } from "@/utils/http-error.util";
import { HttpStatus } from "@/constants/status.constant";
import { HttpResponse } from "@/constants/response.constant";
import { convertToObjectId } from "@/utils/convert-objectId.util";
import { Types } from "mongoose";
import { IConversationRepository } from "@/repositories/interfaces/IConversation.repository";
import { IConversation } from "@/models/conversation.model";
import { IMessage } from "@/models/message.model";
import { IMessageRepository } from "@/repositories/interfaces/IMessage.repository";

@injectable()
export class BlogProfileService implements IBlogProfileService {
    constructor(
        @inject("IBlogProfileRepository") private _blogProfileRepository: IBlogProfileRepository,
        @inject("IConversationRepository") private _conversationRepository: IConversationRepository,
        @inject("IMessageRepository") private _messageRepository: IMessageRepository,
    ) { }

    async createProfile(_id: string, username: string): Promise<void> {
        const userData = await this._blogProfileRepository.create({ _id, username });

        console.log(userData);
    }

    async getProfile(_id: string): Promise<IBlogProfile | null> {
        const profile = await this._blogProfileRepository.findById(_id);

        return profile;
    }

    async updateUsername(userData: Partial<IBlogProfile>, userId: string): Promise<void> {

        await this._blogProfileRepository.update(userId, userData);
    }


    async getPublicProfile(username: string): Promise<IBlogProfile | null> {
        return await this._blogProfileRepository.populateOne(
            { username },
            [
                { path: 'followers', select: '_id username' },
                { path: 'following', select: '_id username' }
            ]
        );
    }

    async followUser(userId: string, followerId: string): Promise<void> {

        const target = await this._blogProfileRepository.findById(followerId);
        const follower = await this._blogProfileRepository.findById(userId);

        if (!target || !follower) {
            throw createHttpError(HttpStatus.NOT_FOUND, HttpResponse.USER_NOT_FOUND);
        }

        const tagetObjectId = convertToObjectId(target?._id as string);
        const folowerObjectId = convertToObjectId(follower._id as string);

        if (follower.following.includes(tagetObjectId)) {
            throw createHttpError(HttpStatus.BAD_REQUEST, HttpResponse.FOLLOWER_EXIST);
        }

        follower.following.push(tagetObjectId);
        target.followers.push(folowerObjectId);

        await this._blogProfileRepository.save(follower);
        await this._blogProfileRepository.save(target);
    }

    async unfollowUser(userId: string, followerId: string): Promise<void> {

        const target = await this._blogProfileRepository.findById(followerId);
        const follower = await this._blogProfileRepository.findById(userId);

        if (!target || !follower) {
            throw createHttpError(HttpStatus.NOT_FOUND, HttpResponse.USER_NOT_FOUND);
        }

        follower.following = follower.following.filter((id) => id.toString() !== (target._id as Types.ObjectId).toString());
        target.followers = target.followers.filter((id) => id.toString() !== (follower._id as Types.ObjectId).toString());

        await this._blogProfileRepository.save(follower);
        await this._blogProfileRepository.save(target);
    }

    async getConversation(user1Id: string, user2Id: string): Promise<IConversation> {

        let conversation = await this._conversationRepository.findOne({
            participants: { $all: [user1Id, user2Id], $size: 2 },
        })

        if(!conversation){
            const user1ObjectId = convertToObjectId(user1Id);
            const user2ObjectId = convertToObjectId(user2Id);

            conversation = await this._conversationRepository.create({participants: [user1ObjectId, user2ObjectId]});

            await this._conversationRepository.save(conversation);
        }

        return conversation;
    }

    async getMutualUsers(userId: string): Promise<IMutualFollower[]> {
        const loggedUser = await this._blogProfileRepository.populateOne(
            { _id: userId },
            ['followers', 'following']
        );

        if(!loggedUser){
            throw createHttpError(HttpStatus.NOT_FOUND, HttpResponse.USER_NOT_FOUND);
        }

        const mutualFollowers = loggedUser.following.filter((followingUser: any) =>
            loggedUser.followers.some((follower: any) => 
                followingUser._id.toString() === follower._id.toString()
            )
        );

        
        const mutualFollowersData = mutualFollowers.map((user: any) => ({
            _id: user._id,
            username: user.username
        }));

        return mutualFollowersData;
    }

    async getMessages(conversationId: string, limit: number): Promise<IMessage[]> {
        const messages = await this._messageRepository.findByQuery({ conversation: conversationId },
            { sort: { createdAt: 1 }, limit });

        console.log(messages,'hhz')
        return messages;
    }
}