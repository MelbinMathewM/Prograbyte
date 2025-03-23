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
import { IComment, ICommentContent } from "@/models/comment.model";

@injectable()
export class PostService implements IPostService {
    constructor(
        @inject("IPostRepository") private postRepository: IPostRepository,
        @inject("ICommentRepository") private commentRepository: ICommentRepository
    ) { }

    async addPost(post: IPost): Promise<IPost> {
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

    async updatePost(blog_id: string, updateData: Partial<IPost>): Promise<IPost | null> {
        const updatedPost = await this.postRepository.update(blog_id, updateData);

        return updatedPost;
    }

    async deletePost(blog_id: string): Promise<void> {

        const post = await this.postRepository.findById(blog_id);
        if (!post) {
            throw createHttpError(HttpStatus.NOT_FOUND, HttpResponse.BLOG_NOT_FOUND);
        }

        if (post.image) {
            const publicId = extractCloudinaryPublicId(post.image);
            if (publicId) {
                await removeFromCloudinary(publicId);
            }
        }

        await this.commentRepository.deleteOneByPostId(blog_id);

        await this.postRepository.delete(blog_id);
    }

    async toggleLike(blog_id: string, user_id: string): Promise<void> {

        const blog = await this.postRepository.findById(blog_id);

        if (!blog) {
            throw createHttpError(HttpStatus.NOT_FOUND, HttpResponse.BLOG_NOT_FOUND);
        }

        const userObjectId = convertToObjectId(user_id);

        if (blog.likes.some((like) => like.equals(userObjectId))) {
            blog.likes = blog.likes.filter((like) => !like.equals(userObjectId));
        } else {
            blog.likes.push(userObjectId);
        }

        await this.postRepository.save(blog);
    }

    async addComment(post_id: string, user_id: string, content: string, username: string): Promise<IComment> {

        let postComments = await this.commentRepository.findOne({ post_id });

        const newComment: Partial<ICommentContent> = {
            user_id: convertToObjectId(user_id),
            username,
            content
        };

        if (postComments) {
            postComments.comments.push(newComment as ICommentContent);
            await this.commentRepository.save(postComments);
        } else {
            postComments = await this.commentRepository.create({
                post_id: convertToObjectId(post_id),
                comments: [newComment]
            } as Partial<IComment>);
        }

        const post = await this.postRepository.findById(post_id);

        if (post) {
            post.comments = post.comments + 1;

            await this.postRepository.save(post);
        }

        return postComments;
    }

    async getComments(post_id: string): Promise<IComment | null> {
        const comments = await this.commentRepository.findOne({ post_id });

        return comments;
    }

    async deleteComment(post_id: string, comment_id: string): Promise<void> {

        const post = await this.postRepository.findById(post_id);

        if (!post) {
            throw createHttpError(HttpStatus.NOT_FOUND, HttpResponse.BLOG_NOT_FOUND);
        }

        const comments = await this.commentRepository.findOne({ post_id });

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

            await this.postRepository.save(post);
        }

        await this.commentRepository.save(comments);
    }

    async toggleCommentLike(post_id: string, comment_id: string, user_id: string): Promise<void> {

        const comments = await this.commentRepository.findOne({ post_id });

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

        await this.commentRepository.save(comments);
    }
}