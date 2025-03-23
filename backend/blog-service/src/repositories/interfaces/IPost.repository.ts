import { IBaseRepository } from "@/repositories/IBase.repository";
import { IPost } from "@/models/post.model";

export interface IPostRepository extends IBaseRepository<IPost> {
  findPostsWithUser(populateFields?: string[]): Promise<IPost[]>;
  getUserPosts(userId: string): Promise<IPost[]>;
}
