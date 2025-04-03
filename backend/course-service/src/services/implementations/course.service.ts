import { inject, injectable } from "inversify";
import { ICourseRepository } from "@/repositories/interfaces/ICourse.repository";
import { ICourse } from "@/models/course.model";
import { createHttpError } from "@/utils/http-error.util";
import { HttpStatus } from "@/constants/status.constant";
import { HttpResponse } from "@/constants/response.constant";
import { deleteFromCloudinary, extractCloudinaryDetails } from "@/utils/cloudinary.util";
import { TopicService } from "./topic.service";
import { ICourseService } from "../interfaces/ICourse.service";
import { IRatingRepository } from "@/repositories/interfaces/IRating.repository";
import { convertToObjectId } from "@/utils/convert-objectid.util";
import { IRating } from "@/models/rating.model";


@injectable()
export class CourseService implements ICourseService {
    constructor(
        @inject("ICourseRepository") private courseRepository: ICourseRepository,
        @inject("IRatingRepository") private ratingRepository: IRatingRepository,
        @inject(TopicService) private topicService: TopicService
    ) {}


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

        const newCourse = await this.courseRepository.create(newCourseData as ICourse);

        return newCourse
    }

    async changeCourseStatus(courseId: string, status: string): Promise<void> {
        await this.courseRepository.changeCourseStatus(courseId, status);
    }

    async getCourses(filters: object, sort: string): Promise<ICourse[]> {
        return await this.courseRepository.getFilteredCourses(filters, sort);
    }
    

    async getCourseDetail(id: string): Promise<ICourse | null> {
        const course = await this.courseRepository.getCourseDetail(id);
        return course;
    }

    async updateCourse(
        courseId: string, 
        courseData: Partial<ICourse>, 
        ): Promise<ICourse | null> {

        const existingCourse = await this.courseRepository.getCourseDetail(courseId);

        if (!existingCourse) throw createHttpError(HttpStatus.NOT_FOUND, HttpResponse.COURSE_NOT_FOUND);

        const updatedFields: Partial<ICourse> = {};

        if (courseData.poster_url && courseData.poster_url !== existingCourse.poster_url) {
            if (existingCourse.poster_url) {
                const { publicId, resourceType, isAuthenticated } = extractCloudinaryDetails(existingCourse.poster_url);
                if (!publicId) {
                    throw createHttpError(HttpStatus.BAD_REQUEST, HttpResponse.PUBLIC_ID_NOT_FOUND);
                }

                await deleteFromCloudinary(publicId, resourceType, isAuthenticated);
            }
            updatedFields.poster_url = courseData.poster_url;
        }

        if (courseData.preview_video_urls && courseData.preview_video_urls.length > 0) {
            const newPreviewVideoUrl = courseData.preview_video_urls[0];

            if (existingCourse.preview_video_urls.length > 0 && newPreviewVideoUrl !== existingCourse.preview_video_urls[0]) {
                const { publicId, resourceType, isAuthenticated } = extractCloudinaryDetails(existingCourse.preview_video_urls[0]);
                if (!publicId) {
                    throw createHttpError(HttpStatus.BAD_REQUEST, HttpResponse.PUBLIC_ID_NOT_FOUND);
                }

                await deleteFromCloudinary(publicId, resourceType, isAuthenticated);
            }

            updatedFields.preview_video_urls = [newPreviewVideoUrl];
        }

        const updatedCourse = await this.courseRepository.updateById(courseId, {
            ...courseData,
            ...updatedFields,
        });

        return updatedCourse;
    }

    async deleteCourse(courseId: string): Promise<void> {
        const course = await this.courseRepository.getCourseDetail(courseId);

        if (!course) {
            throw createHttpError(HttpStatus.NOT_FOUND, HttpResponse.COURSE_NOT_FOUND);
        }

        const topics = await this.topicService.getTopics(courseId);

        const mediaUrls = [
            ...course.preview_video_urls,
            course.poster_url
        ].filter(Boolean);

        if (topics) {
            topics?.topics?.forEach(topic => {
                if (topic.video_url) mediaUrls.push(topic.video_url);
                if (topic.notes_url) mediaUrls.push(topic.notes_url);
            });
        }

        if (mediaUrls.length > 0) {
            await Promise.all(
                mediaUrls.map(async (url) => {
                    const { publicId, resourceType, isAuthenticated } = extractCloudinaryDetails(url);
                    if (!publicId) return;
    
                    await deleteFromCloudinary(publicId, resourceType, isAuthenticated);
                })
            );
        }

        if (topics) {
            await this.courseRepository.deleteById(courseId);
        }

        await this.courseRepository.deleteById(courseId);
    }

    async addRating(userId: string, courseId: string, rating: number, review: string): Promise<void> {
        
        let ratingData = await this.ratingRepository.findOne({courseId});

        const reviewObj = {
            userId: convertToObjectId(userId),
            rating,
            review
        }

        if(ratingData){
            ratingData.reviews.push(reviewObj)

            await this.ratingRepository.save(ratingData);
        }else{
            const courseIdObj = convertToObjectId(courseId);
            ratingData = await this.ratingRepository.create({courseId: courseIdObj, reviews: [reviewObj]});
            await this.ratingRepository.save(ratingData);
        }
    }

    async getRatings(courseId: string): Promise<IRating | null> {
        
        const ratings = await this.ratingRepository.findOne({courseId});

        return ratings;
    }
}