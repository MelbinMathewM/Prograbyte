import { IBlogProfile } from "@/models/blog-profile.model";
import { IComment } from "@/models/comment.model";
import { IPost } from "@/models/post.model";

export interface IPostService {
    addPost(post: IPost): Promise<IPost>;
    getPosts(): Promise<IPost[]>;
    getPostsByUserId(user_id: string): Promise<IPost[]>;
    updatePost(blog_id: string, updateData: Partial<IPost>): Promise<IPost | null>;
    deletePost(blog_id: string): Promise<void>;
    updatePostUsername(userData: Partial<IBlogProfile>, userId: string): Promise<void>;
    toggleLike(blog_id: string, user_id: string): Promise<void>;
    addComment(post_id: string, user_id: string, content: string, username: string): Promise<IComment>;
    getComments(post_id: string): Promise<IComment | null>;
    updateComment(post_id: string, comment_id: string, content: string): Promise<void>;
    deleteComment(post_id: string, comment_id: string): Promise<void>;
    toggleCommentLike(post_id: string, comment_id: string, user_id: string): Promise<void>;
    addSubComment(post_id: string, comment_id: string, user_id: string, content: string, username: string): Promise<void>;
    toggleSubCommentLike(post_id: string, comment_id: string, sub_comment_id: string, user_id: string): Promise<void>;
    deleteSubComment(post_id: string, comment_id: string, sub_comment_id: string): Promise<void>;
}