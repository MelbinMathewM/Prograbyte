import { inject, injectable } from "inversify";
import { IBlogProfileService } from "../interfaces/IBlog-profile.service";
import { IBlogProfileRepository } from "@/repositories/interfaces/IBlog-profile.repository";
import { IBlogProfile } from "@/models/blog-profile.model";

@injectable()
export class BlogProfileService implements IBlogProfileService {
    constructor(
        @inject("IBlogProfileRepository") private blogProfileRepository: IBlogProfileRepository,
    ) { }

    async createProfile(_id: string, username: string): Promise<void> {
        const userData = await this.blogProfileRepository.create({_id, username});

        console.log(userData);
    }

    async getProfile(_id: string): Promise<IBlogProfile | null> {
        const profile = await this.blogProfileRepository.findById(_id);

        return profile;
    }


    async getPublicProfile(username: string): Promise<IBlogProfile | null> {
        const profile = await this.blogProfileRepository.findOne({username});
        
        return profile;
    }
}