import { inject, injectable } from "inversify";
import { IPostService } from "../interfaces/IPost.service";
import { IPostRepository } from "@/repositories/interfaces/IPost.repository";
import { IPost } from "@/models/post.model";
import { createHttpError } from "@/utils/http-error.util";
import { HttpStatus } from "@/constants/status.constant";
import { HttpResponse } from "@/constants/response.constant";
import { ObjectId, Types } from "mongoose";
import { convertToObjectId } from "@/utils/convert-objectId.util";
import { extractCloudinaryPublicId, removeFromCloudinary } from "@/utils/cloudinary.util";
import { ICommentRepository } from "@/repositories/interfaces/IComment.repository";
import { IComment, ICommentContent, ISubComment } from "@/models/comment.model";
import { IBlogProfile } from "@/models/blog-profile.model";

@injectable()
export class PostService implements IPostService {
    constructor(
        @inject("IPostRepository") private _postRepository: IPostRepository,
        @inject("ICommentRepository") private _commentRepository: ICommentRepository
    ) { }

    async addPost(post: IPost): Promise<IPost> {
        
        const blog = await this._postRepository.create(post);

        return blog;
    }

    async getPosts(): Promise<IPost[]> {
        const blogs = await this._postRepository.find();

        return blogs;
    }

    async getPostsByUserId(user_id: string): Promise<IPost[]> {
        const blogs = await this._postRepository.getUserPosts(user_id);

        return blogs;
    }

    async updatePost(blog_id: string, updateData: Partial<IPost>): Promise<IPost | null> {
        const updatedPost = await this._postRepository.update(blog_id, updateData);

        return updatedPost;
    }

    async deletePost(blog_id: string): Promise<void> {

        const post = await this._postRepository.findById(blog_id);
        if (!post) {
            throw createHttpError(HttpStatus.NOT_FOUND, HttpResponse.BLOG_NOT_FOUND);
        }

        if (post.image) {
            const publicId = extractCloudinaryPublicId(post.image);
            if (publicId) {
                await removeFromCloudinary(publicId);
            }
        }

        await this._commentRepository.deleteOneByPostId(blog_id);

        await this._postRepository.delete(blog_id);
    }

    async updatePostUsername(userData: Partial<IBlogProfile>, userId: string): Promise<void> {
        
        await this._postRepository.updateMany(
            { user_id: userId }, 
            { $set: { username: userData.username } }
        );
        await this._commentRepository.updateMany(
            { "comments.user_id": userId }, 
            { $set: { "comments.$[elem].username": userData.username } },
            { arrayFilters: [{ "elem.user_id": userId }] }
        );
        await this._commentRepository.updateMany(
            { "comments.sub_comments.user_id": userId },
            { $set: { "comments.$[].sub_comments.$[subElem].username": userData.username } },
            { arrayFilters: [{ "subElem.user_id": userId }] }
        );
    }

    async toggleLike(blog_id: string, user_id: string): Promise<void> {

        const blog = await this._postRepository.findById(blog_id);

        if (!blog) {
            throw createHttpError(HttpStatus.NOT_FOUND, HttpResponse.BLOG_NOT_FOUND);
        }

        const userObjectId = convertToObjectId(user_id);

        if (blog.likes.some((like) => like.equals(userObjectId))) {
            blog.likes = blog.likes.filter((like) => !like.equals(userObjectId));
        } else {
            blog.likes.push(userObjectId);
        }

        await this._postRepository.save(blog);
    }

    async addComment(post_id: string, user_id: string, content: string, username: string): Promise<IComment> {

        let postComments = await this._commentRepository.findOne({ post_id });

        const newComment: Partial<ICommentContent> = {
            user_id: convertToObjectId(user_id),
            username,
            content
        };

        if (postComments) {
            postComments.comments.push(newComment as ICommentContent);
            await this._commentRepository.save(postComments);
        } else {
            postComments = await this._commentRepository.create({
                post_id: convertToObjectId(post_id),
                comments: [newComment]
            } as Partial<IComment>);
        }

        const post = await this._postRepository.findById(post_id);

        if (post) {
            post.comments = post.comments + 1;

            await this._postRepository.save(post);
        }

        return postComments;
    }

    async getComments(post_id: string): Promise<IComment | null> {
        const comments = await this._commentRepository.findOne({ post_id });

        return comments;
    }

    async updateComment(post_id: string, comment_id: string, content: string): Promise<void> {
        
        const comments = await this._commentRepository.findOne({ post_id });
        if (!comments) {
            throw createHttpError(HttpStatus.NOT_FOUND, HttpResponse.COMMENTS_NOT_FOUND);
        }

        const targetComment = comments.comments.find((c) => (c._id as Types.ObjectId).toString() === comment_id);
        if (!targetComment) {
            throw createHttpError(HttpStatus.NOT_FOUND, HttpResponse.COMMENT_NOT_FOUND);
        }

        targetComment.content = content;

        await this._commentRepository.save(comments);
    }

    async deleteComment(post_id: string, comment_id: string): Promise<void> {

        const post = await this._postRepository.findById(post_id);

        if (!post) {
            throw createHttpError(HttpStatus.NOT_FOUND, HttpResponse.BLOG_NOT_FOUND);
        }

        const comments = await this._commentRepository.findOne({ post_id });

        if (!comments) {
            throw createHttpError(HttpStatus.NOT_FOUND, HttpResponse.COMMENTS_NOT_FOUND);
        }

        const targetComment = comments.comments.find((c) => (c._id as Types.ObjectId).toString() === comment_id);
        if (!targetComment) {
            throw createHttpError(HttpStatus.NOT_FOUND, HttpResponse.COMMENT_NOT_FOUND);
        }

        comments.comments = comments.comments.filter((c) => (c._id as Types.ObjectId).toString() !== comment_id);

        if (post) {
            post.comments = post.comments - 1;

            await this._postRepository.save(post);
        }

        await this._commentRepository.save(comments);
    }

    async toggleCommentLike(post_id: string, comment_id: string, user_id: string): Promise<void> {

        const comments = await this._commentRepository.findOne({ post_id });

        if (!comments) {
            throw createHttpError(HttpStatus.NOT_FOUND, HttpResponse.COMMENTS_NOT_FOUND);
        }

        const targetComment = comments.comments.find((c) => (c._id as Types.ObjectId).toString() === comment_id);

        if (!targetComment) {
            throw createHttpError(HttpStatus.NOT_FOUND, HttpResponse.COMMENT_NOT_FOUND);
        }

        const userObjectId = convertToObjectId(user_id);

        if (targetComment.likes.some((like) => like.equals(userObjectId))) {
            targetComment.likes = targetComment.likes.filter((like) => !like.equals(userObjectId));
        } else {
            targetComment.likes.push(userObjectId);
        }

        await this._commentRepository.save(comments);
    }

    async addSubComment(post_id: string, comment_id: string, user_id: string, content: string, username: string): Promise<void> {
        
        let postComment = await this._commentRepository.findOne({ post_id });

        if(!postComment){
            throw createHttpError(HttpStatus.NOT_FOUND, HttpResponse.COMMENTS_NOT_FOUND);
        }

        const targetComment = postComment.comments.find((c) => (c._id as Types.ObjectId).toString() === comment_id);
        if (!targetComment) {
            throw createHttpError(HttpStatus.NOT_FOUND, HttpResponse.COMMENT_NOT_FOUND);
        }

        const newSubComment: Partial<ISubComment> = {
            user_id: convertToObjectId(user_id),
            username,
            content
        }

        targetComment.sub_comments.push(newSubComment as ISubComment);

        await this._commentRepository.save(postComment);
    }

    async toggleSubCommentLike(post_id: string, comment_id: string, sub_comment_id: string, user_id: string): Promise<void> {
        
        const comments = await this._commentRepository.findOne({ post_id });
        if (!comments) {
            throw createHttpError(HttpStatus.NOT_FOUND, HttpResponse.COMMENTS_NOT_FOUND);
        }

        const mainComment = comments.comments.find((c) => (c._id as Types.ObjectId).toString() === comment_id);
        if (!mainComment) {
            throw createHttpError(HttpStatus.NOT_FOUND, HttpResponse.COMMENT_NOT_FOUND);
        }

        const targetComment = mainComment.sub_comments.find((c) => (c._id as Types.ObjectId).toString() === sub_comment_id);
        if (!targetComment) {
            throw createHttpError(HttpStatus.NOT_FOUND, HttpResponse.SUB_COMMENT_NOT_FOUND);
        }

        const userObjectId = convertToObjectId(user_id);

        const likedIndex = targetComment.likes.indexOf(userObjectId);
        if (likedIndex === -1) {
            targetComment.likes.push(userObjectId);
        } else {
            targetComment.likes.splice(likedIndex, 1);
        }

        await this._commentRepository.save(comments);
    }

    async deleteSubComment(post_id: string, comment_id: string, sub_comment_id: string): Promise<void> {
        
        const comments = await this._commentRepository.findOne({ post_id });
        if (!comments) {
            throw createHttpError(HttpStatus.NOT_FOUND, HttpResponse.COMMENTS_NOT_FOUND);
        }

        const mainComment = comments.comments.find((c) => (c._id as Types.ObjectId).toString() === comment_id);
        if (!mainComment) {
            throw createHttpError(HttpStatus.NOT_FOUND, HttpResponse.COMMENT_NOT_FOUND);
        }

        const updatedSubComments = mainComment.sub_comments.filter(
            (c) => (c._id as Types.ObjectId).toString() !== sub_comment_id
        );

        if (updatedSubComments.length === mainComment.sub_comments.length) {
            throw createHttpError(HttpStatus.NOT_FOUND, HttpResponse.SUB_COMMENT_NOT_FOUND);
        }

        mainComment.sub_comments = updatedSubComments;

        await this._commentRepository.save(comments);
    }
}