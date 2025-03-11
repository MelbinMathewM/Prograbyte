import { inject, injectable } from "inversify";
import { ICourseRepository } from "../repositories/interfaces/ICourseRepository";
import { ICategory } from "../models/categoryModel";
import { ICourse } from "../models/courseModel";
import { ITopic } from "../models/topicModel";
import cloudinary from "../config/cloudinary";
import { createHttpError } from "../utils/httpError";
import { HttpStatus } from "../constants/status";
import { HttpResponse } from "../constants/responseMessage";
import Wishlist, { IWishlist } from "../models/wishlistModel";
import { convertToObjectId } from "../utils/mongooseObjectId";


@injectable()
export class CourseService {
    constructor(@inject("ICourseRepository") private courseRepository: ICourseRepository) { }

    async createCategory(category: ICategory): Promise<ICategory> {

        const existingCategory = await this.courseRepository.getCategoryByName(category.name.toLowerCase());

        if (existingCategory) throw createHttpError(HttpStatus.CONFLICT, HttpResponse.CATEGORY_EXIST);

        const newCategory = await this.courseRepository.createCategory(category);

        if (!newCategory) throw createHttpError(HttpStatus.BAD_REQUEST, HttpResponse.CATEGORY_INSERT_ERROR);

        return newCategory;
    }

    async getCategories(): Promise<ICategory[]> {

        const categories = await this.courseRepository.getCategories();

        if (!categories) throw createHttpError(HttpStatus.INTERNAL_SERVER_ERROR, HttpResponse.CATEGORY_FETCH_ERROR);

        return categories;
    }

    async updateCategory(id: string, updatedData: Partial<ICategory>): Promise<ICategory> {

        const existingCategory = await this.courseRepository.getCategoryByNameAndNotId(updatedData.name?.toLowerCase() as string, id);

        if (existingCategory) {
            throw createHttpError(HttpStatus.CONFLICT, HttpResponse.CATEGORY_EXIST);
        }

        const updatedCategory = await this.courseRepository.updateCategory(id, updatedData);

        if (!updatedCategory) {
            throw createHttpError(HttpStatus.BAD_REQUEST, HttpResponse.CATEGORY_UPDATE_ERROR);
        }

        return updatedCategory;
    }

    async deleteCategory(id: string): Promise<void> {
        const existingCategory = await this.courseRepository.getCategoryById(id);

        if (!existingCategory) {
            throw createHttpError(HttpStatus.NOT_FOUND, HttpResponse.CATEGORY_NOT_FOUND);
        }

        const deleted = await this.courseRepository.deleteCategory(id);

        if (!deleted) {
            throw createHttpError(HttpStatus.INTERNAL_SERVER_ERROR, HttpResponse.CATEGORY_DELETE_ERROR);
        }
    }



    async createCourse(course: ICourse): Promise<ICourse> {
        const newCourse = await this.courseRepository.createCourse(course);

        return newCourse
    }

    async changeCourseStatus(courseId: string, status: string): Promise<void> {
        await this.courseRepository.changeCourseStatus(courseId, status);
    }

    async createTopic(topic: ITopic[]): Promise<ITopic[]> {
        const newTopics = await this.courseRepository.createTopic(topic);

        return newTopics;
    }

    async getCoursesByTutorId(tutor_id: string): Promise<ICourse[] | null> {
        const courses = await this.courseRepository.getCoursesByTutorId(tutor_id);

        return courses;
    }

    async getCourses(): Promise<ICourse[] | null> {
        const courses = await this.courseRepository.getCourses();

        return courses;
    }

    async getCoursesByCategoryId(categoryId: string): Promise<ICourse[] | null> {
        let courses = await this.courseRepository.getCoursesByCategoryId(categoryId);

        if (!courses) {
            courses = [];
        }

        return courses;
    }

    async getCourseDetail(id: string): Promise<ICourse | null> {
        const course = await this.courseRepository.getCourseDetail(id);
        return course;
    }

    async getTopics(course_id: string): Promise<ITopic[] | null> {
        const topics = await this.courseRepository.getTopics(course_id);

        return topics;
    }

    async getTopicById(topicId: string): Promise<ITopic> {
        const topic = await this.courseRepository.getTopicById(topicId);

        return topic;
    }

    async updateCourse(courseId: string, courseData: Partial<ICourse>, files?: Express.Multer.File[]): Promise<ICourse | null> {
        const existingCourse = await this.courseRepository.getCourseDetail(courseId);
        if (!existingCourse) throw new Error("Course not found");

        const updatedFields: Partial<ICourse> = {};

        if (files && files.length > 0) {
            const poster = Array.isArray(files) ? files.find(file => file.fieldname === `poster`) : undefined;
            const preview_video = Array.isArray(files) ? files.find(file => file.fieldname === `preview_video`) : undefined;
            if (poster) {
                if (existingCourse.poster_url) {
                    const publicId = await this.extractPublicId(existingCourse.poster_url);
                    await cloudinary.uploader.destroy(publicId);
                }
                updatedFields.poster_url = poster?.path;
            }
            if (preview_video) {
                if (existingCourse.preview_video_urls) {
                    const publicId = await this.extractPublicId(existingCourse.preview_video_urls[0]);
                    console.log(publicId, 'publicId')
                    await cloudinary.uploader.destroy(publicId, { resource_type: "video" });
                }
                updatedFields.preview_video_urls = [preview_video?.path];
            }
        }

        const updatedCourse = await this.courseRepository.findCourseAndUpdate(courseId, {
            ...courseData,
            ...updatedFields,
        });

        return updatedCourse;
    }

    async extractPublicId(url: string): Promise<string> {
        const parts = url.split("/");
        return parts[parts.length - 1].split(".")[0];
    }

    async getWishlist(userId: string): Promise<IWishlist> {
        let wishlist = await this.courseRepository.getWishlistByUserId(userId);

        const objectIdUser = convertToObjectId(userId)
        if(!wishlist){
            wishlist = await this.courseRepository.createWishlist({ userId: objectIdUser, items: [] });
        }

        return wishlist;
    }

    async addWishlist(userId: string, courseId: string): Promise<IWishlist> {

        let wishlist = await this.courseRepository.getWishlistByUserId(userId);

        const objectIdCourse = convertToObjectId(courseId);
        const objectIdUser = convertToObjectId(userId);

        if (!wishlist) {
            wishlist = await this.courseRepository.createWishlist({ userId: objectIdUser, items: [objectIdCourse] });
        } else {
            const itemExists = wishlist.items.some(item => item.toString() === courseId);
            if (!itemExists) {
                wishlist.items.push(objectIdCourse);
            } else {
                throw createHttpError(HttpStatus.BAD_REQUEST, HttpResponse.COURSE_EXIST_WISHLIST);
            }
        }

        const newWishlist = await wishlist.save();

        return newWishlist;
    }

    async removeWishlist(userId: string, courseId: string): Promise<void> {
        const wishlist = await this.courseRepository.getWishlistByUserId(userId);
        if (!wishlist) {
            throw createHttpError(HttpStatus.NOT_FOUND, HttpResponse.WISHLIST_NOT_FOUND);
        }

        const itemIndex = wishlist.items.findIndex(item => item._id.toString() === courseId);

        if (itemIndex === -1) {
            throw createHttpError(HttpStatus.BAD_REQUEST, HttpResponse.COURSE_NOT_FOUND_WISHLIST);
        }

        wishlist.items.splice(itemIndex, 1);

        await wishlist.save();
    }

}