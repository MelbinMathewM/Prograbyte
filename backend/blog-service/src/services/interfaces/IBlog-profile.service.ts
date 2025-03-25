import { IBlogProfile } from "@/models/blog-profile.model";

export interface IBlogProfileService {
    createProfile(_id: string, username: string): Promise<void>;
    getProfile(_id: string): Promise<IBlogProfile | null>;
    getPublicProfile(username: string): Promise<IBlogProfile | null>;
}