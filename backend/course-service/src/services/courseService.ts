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
import { generateToken, verifyToken } from "../utils/jwt";
import getSecureVideoUrl from "../utils/cloudinary";
import { IEnrolledCourses } from "../models/enrolledCoursesModel";


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

    async enrollCourse(courseId: string, userId: string, paymentAmount: number, paymentId: string) {

        const objectIdUserId = convertToObjectId(userId);
        const objectIdCourseId = convertToObjectId(courseId);


        let enrollment = await this.courseRepository.getEnrolledCoursesByUserId(objectIdUserId);

        if(enrollment){
            const isAlreadyEnrolled = enrollment.courses.some(c => c.courseId.equals(objectIdCourseId));
            if(isAlreadyEnrolled){
                throw createHttpError(HttpStatus.CONFLICT, HttpResponse.COURSE_EXIST_ENROLLED);
            }

            enrollment.courses.push({ courseId: objectIdCourseId, paymentAmount, enrolledAt: new Date(), paymentId });
            await (enrollment as any).save();
        }else{

            await this.courseRepository.createEnrolledCourse(objectIdUserId,{
                courseId: objectIdCourseId, 
                paymentAmount, 
                enrolledAt: new Date(), 
                paymentId
            })
        }
    }

    async getEnrolledCourses(userId: string): Promise<IEnrolledCourses> {

        const objectIdUserId = convertToObjectId(userId);

        const enrolledCourses = await this.courseRepository.getEnrolledCoursesByUserId(objectIdUserId);

        if(!enrolledCourses){
            throw createHttpError(HttpStatus.NO_CONTENT,HttpResponse.ENROLLED_COURSES_NOT_FOUND);
        }

        return enrolledCourses;
    }

    async getTopics(course_id: string): Promise<Partial<ITopic[]> | null> {
        const topics = await this.courseRepository.getTopics(course_id);

        if (!topics) return null;

        return Promise.all(
            topics.map(async (topic) => {
                const plainTopic = topic.toObject();
                return {
                    ...plainTopic,
                    video_url: await this.extractPublicId(plainTopic.video_url),
                    notes_url: await this.extractPublicId(plainTopic.notes_url),
                };
            })
        );
    }

    async getTopicById(topicId: string): Promise<ITopic | null> {
        const topic = await this.courseRepository.getTopicById(topicId);

        if (!topic) return null;

        const plainTopic = topic.toObject();

        return {
            ...plainTopic,
            video_url: await this.extractPublicId(plainTopic.video_url),
            notes_url: await this.extractPublicId(plainTopic.notes_url),
        };
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
        return url
            .replace(/^https:\/\/res\.cloudinary\.com\/[^/]+\/(?:image|video)\/(?:upload|authenticated)\/s--[^/]+--\/v\d+\//, "")
            .replace(/\.\w+$/, "");
    }
    

    async getWishlist(userId: string): Promise<IWishlist> {
        let wishlist = await this.courseRepository.getWishlistByUserId(userId);

        const objectIdUser = convertToObjectId(userId)
        if (!wishlist) {
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

    async getVideoToken(publicId: string): Promise<string> {
        const token = generateToken({publicId});

        return token;
    }


    async getSecureVideo(token: string): Promise<string> {

        const decoded = verifyToken(token) as { publicId: string };
        console.log(decoded,'decoded')
        const publicId = decoded.publicId;

        if(!publicId){
            throw createHttpError(HttpStatus.NO_CONTENT,HttpResponse.NO_DECODED_TOKEN);
        }

        const secureUrl = await getSecureVideoUrl(publicId);

        console.log("Signed Video URL:", secureUrl);

        return secureUrl;
    }

}