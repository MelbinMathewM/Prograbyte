import { IComment } from "@/models/comment.model";
import { IPost } from "@/models/post.model";

export interface IPostService {
    addPost(post: IPost): Promise<IPost>;
    getPosts(): Promise<IPost[]>;
    getPostsByUserId(user_id: string): Promise<IPost[]>;
    updatePost(blog_id: string, updateData: Partial<IPost>): Promise<IPost | null>;
    deletePost(blog_id: string): Promise<void>;
    toggleLike(blog_id: string, user_id: string): Promise<void>;
    addComment(post_id: string, user_id: string, content: string, username: string): Promise<IComment>;
    getComments(post_id: string): Promise<IComment | null>;
    deleteComment(post_id: string, comment_id: string): Promise<void>;
    toggleCommentLike(post_id: string, comment_id: string, user_id: string): Promise<void>;
}