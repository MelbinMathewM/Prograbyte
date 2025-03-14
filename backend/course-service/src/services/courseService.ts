import { inject, injectable } from "inversify";
import { ICourseRepository } from "../repositories/interfaces/ICourseRepository";
import { ICategory } from "../models/categoryModel";
import { ICourse } from "../models/courseModel";
import { ITopic, ITopics } from "../models/topicModel";
import cloudinary from "../config/cloudinary";
import { createHttpError } from "../utils/httpError";
import { HttpStatus } from "../constants/status";
import { HttpResponse } from "../constants/responseMessage";
import Wishlist, { IWishlist } from "../models/wishlistModel";
import { convertToObjectId } from "../utils/mongooseObjectId";
import { generateToken, verifyToken } from "../utils/jwt";
import getSecureVideoUrl from "../utils/cloudinary";
import { IEnrolledCourses } from "../models/enrolledCoursesModel";
import mongoose from "mongoose";


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

        const price = Number(course.price);

        const newCourseData = {
            title: course.title,
            description: course.description,
            category_id: course.category_id,
            tutor_id: course.tutor_id,
            price,
            preview_video_urls: course?.preview_video_urls,
            poster_url: course.poster_url,
        };

        const newCourse = await this.courseRepository.createCourse(newCourseData as ICourse);

        return newCourse
    }

    async changeCourseStatus(courseId: string, status: string): Promise<void> {
        await this.courseRepository.changeCourseStatus(courseId, status);
    }

    async createTopic(topics: ITopics): Promise<ITopics | null> {

        let existTopic = await this.courseRepository.getTopics(topics.course_id as string);

        let newTopics;
        if (existTopic) {
            existTopic.topics.push(...topics?.topics);
            newTopics = await existTopic?.save();
        } else {
            const objectIdCourseId = convertToObjectId(topics.course_id as string);
            newTopics = await this.courseRepository.createTopic({ course_id: objectIdCourseId, topics: topics.topics })
        }

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

        if (enrollment) {
            const isAlreadyEnrolled = enrollment.courses.some(c => c.courseId.equals(objectIdCourseId));
            if (isAlreadyEnrolled) {
                throw createHttpError(HttpStatus.CONFLICT, HttpResponse.COURSE_EXIST_ENROLLED);
            }

            enrollment.courses.push({ courseId: objectIdCourseId, paymentAmount, enrolledAt: new Date(), paymentId });
            await (enrollment as any).save();
        } else {

            await this.courseRepository.createEnrolledCourse(objectIdUserId, {
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

        if (!enrolledCourses) {
            throw createHttpError(HttpStatus.NO_CONTENT, HttpResponse.ENROLLED_COURSES_NOT_FOUND);
        }

        return enrolledCourses;
    }

    async getTopics(course_id: string): Promise<Partial<ITopics> | null> {

        const topics = await this.courseRepository.getTopics(course_id);

        if (!topics) return null;

        const transformedTopics = await Promise.all(
            topics.topics.map(async (topic) => {
                return {
                    title: topic.title,
                    level: topic.level,
                    video_url: await this.extractPublicId(topic.video_url),
                    notes_url: topic.notes_url ? await this.extractPublicId(topic.notes_url) : "",
                    _id: topic?._id,
                };
            })
        );

        return {
            _id: topics._id,
            course_id: topics.course_id,
            topics: transformedTopics,
        };
    }

    async getTopicById(topicsId: string, topicId: string): Promise<ITopic | null> {

        const topics = await this.courseRepository.getTopicById(topicsId);

        console.log(topics, 'tps')

        if (!topics) return null;

        const topic = topics.topics.find((t: any) => t._id.toString() === topicId);

        console.log(topic, 'tp')

        if (!topic) return null;


        return {
            _id: topic._id,
            title: topic.title,
            level: topic.level,
            video_url: await this.extractPublicId(topic.video_url),
            notes_url: topic.notes_url ? await this.extractPublicId(topic.notes_url) : "",
        };
    }

    async updateCourse(courseId: string, courseData: Partial<ICourse>, files?: Express.Multer.File[]): Promise<ICourse | null> {

        const existingCourse = await this.courseRepository.getCourseDetail(courseId);
        if (!existingCourse) throw createHttpError(HttpStatus.NOT_FOUND, HttpResponse.COURSE_NOT_FOUND);

        const updatedFields: Partial<ICourse> = {};

        if (courseData.poster_url && courseData.poster_url !== existingCourse.poster_url) {
            if (existingCourse.poster_url) {
                const publicId = await this.extractPublicId2(existingCourse.poster_url);
                await cloudinary.uploader.destroy(publicId);
            }
            updatedFields.poster_url = courseData.poster_url;
        }

        if (courseData.preview_video_urls && courseData.preview_video_urls.length > 0) {
            const newPreviewVideoUrl = courseData.preview_video_urls[0];

            if (existingCourse.preview_video_urls.length > 0 && newPreviewVideoUrl !== existingCourse.preview_video_urls[0]) {
                const publicId = await this.extractPublicId2(existingCourse.preview_video_urls[0]);
                await cloudinary.uploader.destroy(publicId, { resource_type: "video" });
            }

            updatedFields.preview_video_urls = [newPreviewVideoUrl];
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

    async extractPublicId2(fileUrl: string): Promise<string> {
        const parts = fileUrl.split("/");

        const versionIndex = parts.findIndex(part => part.startsWith("v") && !isNaN(Number(part.substring(1))));

        if (versionIndex !== -1) {
            parts.splice(versionIndex, 1);
        }

        const publicIdParts = parts.slice(parts.indexOf("upload") + 1);
        const publicId = publicIdParts.join("/").split(".")[0];

        return publicId;
    }

    async deleteCourse(courseId: string): Promise<void> {
        const course = await this.courseRepository.getCourseDetail(courseId);

        if (!course) {
            throw createHttpError(HttpStatus.NOT_FOUND, HttpResponse.COURSE_NOT_FOUND);
        }

        const topics = await this.courseRepository.getTopics(courseId);

        const mediaUrls = [
            ...course.preview_video_urls,
            course.poster_url
        ].filter(Boolean);

        if (topics) {
            topics.topics.forEach(topic => {
                if (topic.video_url) mediaUrls.push(topic.video_url);
                if (topic.notes_url) mediaUrls.push(topic.notes_url);
            });
        }

        const publicIds = await Promise.all(mediaUrls.map(url => this.extractPublicId3(url)));

        await Promise.all(
            publicIds.map(({ publicId, resourceType, isAuthenticated }) => {
                return cloudinary.uploader.destroy(publicId, {
                    resource_type: resourceType,
                    type: isAuthenticated ? 'authenticated' : 'upload'
                });
            })
        )

        if (topics) {
            await this.courseRepository.deleteTopicsByCourseId(courseId);
        }

        await this.courseRepository.deleteCourseById(courseId);
    }

    async deleteTopic(topicsId: string, topicId: string): Promise<void> {

        const topics = await this.courseRepository.getTopicById(topicsId);

        if (!topics) {
            throw createHttpError(HttpStatus.NOT_FOUND, HttpResponse.TOPICS_NOT_FOUND);
        }

        const topicIndex = topics.topics.findIndex((t: any) => t._id.toString() === topicId);

        if (topicIndex === -1) {
            throw createHttpError(HttpStatus.NOT_FOUND, HttpResponse.TOPIC_NOT_FOUND);
        }

        const topic = topics.topics[topicIndex];

        const mediaUrls: string[] = [];
        if (topic.video_url) mediaUrls.push(topic.video_url);
        if (topic.notes_url) mediaUrls.push(topic.notes_url);

        if(mediaUrls.length > 0){
            const publicIds = await Promise.all(mediaUrls.map(url => this.extractPublicId3(url)));

            await Promise.all(
                publicIds.map(({ publicId, resourceType, isAuthenticated }) => {
                    return cloudinary.uploader.destroy(publicId, {
                        resource_type: resourceType,
                        type: isAuthenticated ? 'authenticated' : 'upload'
                    });
                })
            )
        }

        topics.topics.splice(topicIndex, 1);

        await topics.save();
    }

    private extractPublicId3(url: string): { publicId: string; resourceType: string; isAuthenticated: boolean } {
        try {
            const match = url.match(/\/(upload|authenticated)\/(?:s--[^/]+--\/)?v\d+\/(.+?)(\.\w+)?$/);
            if (!match) {
                console.warn("Invalid Cloudinary URL:", url);
                return { publicId: "", resourceType: "auto", isAuthenticated: false };
            }

            const [, type, publicId] = match;
            const resourceType = url.includes("/video/") ? "video" : url.includes("/image/") ? "image" : "raw";
            const isAuthenticated = type === "authenticated";

            return { publicId, resourceType, isAuthenticated };
        } catch (error) {
            console.error("Error extracting Cloudinary Public ID:", error);
            return { publicId: "", resourceType: "auto", isAuthenticated: false };
        }
    }


    determineResourceType(publicId: string): "image" | "video" | "raw" {
        if (publicId.includes("/video/")) return "video";
        if (publicId.includes("/raw/")) return "raw";
        return "image";
    }

    async updateTopic(topicsId: string, topicId: string, topicData: ITopic): Promise<ITopic> {

        const topics = await this.courseRepository.getTopicById(topicsId);

        if (!topics) {
            throw createHttpError(HttpStatus.NOT_FOUND, HttpResponse.TOPICS_NOT_FOUND);
        }

        const topicIndex = topics.topics.findIndex((t: any) => t._id.toString() === topicId);

        if (topicIndex === -1) {
            throw createHttpError(HttpStatus.NOT_FOUND, HttpResponse.TOPIC_NOT_FOUND);
        }

        const topic = topics.topics[topicIndex];

        if (topicData.video_url && topicData.video_url !== topic.video_url) {
            if (topic.video_url) {
                const publicId = await this.extractPublicId2(topic.video_url);
                await cloudinary.uploader.destroy(publicId);
            }
        }

        if (topicData.notes_url && topicData.notes_url !== topic.notes_url) {
            if (topic.notes_url) {
                const publicId = await this.extractPublicId2(topic.notes_url);
                await cloudinary.uploader.destroy(publicId);
            }
        }

        topics.topics[topicIndex] = {
            ...topic,
            title: topicData.title || topic.title,
            level: topicData.level || topic.level,
            video_url: topicData.video_url || topic.video_url,
            notes_url: topicData.notes_url || topic.notes_url
        };

        await topics.save();

        return topics.topics[topicIndex];
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

        const token = generateToken({ publicId });

        return token;
    }


    async getSecureVideo(token: string): Promise<string> {

        const decoded = verifyToken(token) as { publicId: string };

        if (!decoded || !decoded.publicId) {
            throw createHttpError(HttpStatus.NO_CONTENT, HttpResponse.NO_DECODED_TOKEN);
        }
        const publicId = decoded.publicId;

        if (!publicId) {
            throw createHttpError(HttpStatus.NO_CONTENT, HttpResponse.NO_DECODED_TOKEN);
        }

        const secureUrl = await getSecureVideoUrl(publicId);

        return secureUrl;
    }

}