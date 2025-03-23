import { Types } from "mongoose";
import { BaseRepository } from "@/repositories/base.repository";
import Comment, { IComment, ICommentContent } from "@/models/comment.model";
import { convertToObjectId } from "@/utils/convert-objectId.util";
import { ICommentRepository } from "@/repositories/interfaces/IComment.repository";
import { injectable } from "inversify";

@injectable()
export class CommentRepository extends BaseRepository<IComment> implements ICommentRepository {
    constructor() {
        super(Comment);
    }

    async deleteOneByPostId(post_id: string): Promise<void> {
        await Comment.findOneAndDelete({post_id});
    }
}
