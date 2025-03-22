import Post, { IPost } from "@/models/post.model";
import { BaseRepository } from "../base.repository";
import { IPostRepository } from "../interfaces/IPost.repository";
import { FilterQuery } from "mongoose";
import { injectable } from "inversify";

@injectable()
export class PostRepository extends BaseRepository<IPost> implements IPostRepository {
    constructor() {
        super(Post);
    }

    async findPostsWithUser(populateFields: string[] = ["user_id"]): Promise<IPost[]> {
        return await Post.find().populate(populateFields)
    }

    async getUserPosts(userId: string): Promise<IPost[]> {
        const filter: FilterQuery<IPost> = { user_id: userId };
        return await Post.find(filter).sort({ createdAt: -1 });
    }
}