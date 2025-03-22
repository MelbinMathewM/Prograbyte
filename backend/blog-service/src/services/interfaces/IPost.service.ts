import { IPost } from "@/models/post.model";

export interface IPostService {
    addPost(post: IPost): Promise<IPost>;
    getPosts(): Promise<IPost[]>;
    getPostsByUserId(user_id: string): Promise<IPost[]>;
}