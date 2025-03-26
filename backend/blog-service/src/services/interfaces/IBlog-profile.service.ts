import { IBlogProfile, MutualFollower } from "@/models/blog-profile.model";
import { IConversation } from "@/models/conversation.model";
import { IMessage } from "@/models/message.model";

export interface IBlogProfileService {
    createProfile(_id: string, username: string): Promise<void>;
    getProfile(_id: string): Promise<IBlogProfile | null>;
    getPublicProfile(username: string): Promise<IBlogProfile | null>;
    followUser(userId: string, followerId: string): Promise<void>;
    unfollowUser(userId: string, followerId: string): Promise<void>;
    getConversation(user1Id: string, user2Id: string): Promise<IConversation>;
    getMutualUsers(userId: string): Promise<MutualFollower[]>;
    getMessages(conversationId: string, limit: number): Promise<IMessage[]>;
}