import { inject, injectable } from "inversify";
import { IPostService } from "../interfaces/IPost.service";
import { IPostRepository } from "@/repositories/interfaces/IPost.repository";
import { IPost } from "@/models/post.model";

@injectable()
export class PostService implements IPostService {
    constructor(@inject("IPostRepository") private postRepository : IPostRepository) {}

    async addPost (post: IPost): Promise<IPost> {
        const blog = await this.postRepository.create(post);

        console.log(blog)

        return blog;
    }

    async getPosts(): Promise<IPost[]> {
        const blogs = await this.postRepository.find();

        return blogs;
    }

    async getPostsByUserId(user_id: string): Promise<IPost[]> {
        const blogs = await this.postRepository.getUserPosts(user_id);

        return blogs;
    }
}