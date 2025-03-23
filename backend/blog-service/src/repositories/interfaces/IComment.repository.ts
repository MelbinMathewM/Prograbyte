import { IComment } from "@/models/comment.model";
import { IBaseRepository } from "@/repositories/IBase.repository";

export interface ICommentRepository extends IBaseRepository<IComment> {
    deleteOneByPostId(post_id: string): Promise<void>;
}