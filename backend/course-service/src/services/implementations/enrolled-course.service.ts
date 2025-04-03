import { inject } from "inversify";
import { injectable } from "inversify";
import { IEnrolledCourseRepository } from "@/repositories/interfaces/IEnrolled-course.repository";
import { convertToObjectId } from "@/utils/convert-objectid.util";
import { createHttpError } from "@/utils/http-error.util";
import { HttpStatus } from "@/constants/status.constant";
import { HttpResponse } from "@/constants/response.constant";
import { IEnrolledCourse, IEnrolledCourses, IProgress } from "@/models/enrolled-course.model";
import { IEnrolledCourseService } from "../interfaces/IEnrollment.service";
import { TopicService } from "./topic.service";

@injectable()
export class EnrolledCourseService implements IEnrolledCourseService {
    constructor(
        @inject("IEnrolledCourseRepository") private enrolledCourseRepository: IEnrolledCourseRepository,
        @inject(TopicService) private topicService: TopicService
    ) { }

    async enrollCourse(courseId: string, userId: string, paymentAmount: number, paymentId: string): Promise<void> {

        const objectIdUserId = convertToObjectId(userId);
        const objectIdCourseId = convertToObjectId(courseId);

        let enrollment = await this.enrolledCourseRepository.getEnrolledCoursesByUserId(objectIdUserId);

        const topics = await this.topicService.getTopics(courseId);

        if (!topics) {
            throw createHttpError(HttpStatus.NOT_FOUND, HttpResponse.TOPICS_NOT_FOUND);
        }

        const progress: IProgress[] = (topics?.topics || []).map(topic => ({
            topicId: convertToObjectId(topic?._id as string),
            watchedDuration: 0,
            isCompleted: false
        }));
        

        const course: IEnrolledCourse = {
            courseId: objectIdCourseId,
            paymentAmount,
            enrolledAt: new Date(),
            paymentId,
            completionStatus: 0,
            progress
        }

        if (enrollment) {
            const isAlreadyEnrolled = enrollment.courses.some(c => c.courseId.equals(objectIdCourseId));
            if (isAlreadyEnrolled) {
                throw createHttpError(HttpStatus.CONFLICT, HttpResponse.COURSE_EXIST_ENROLLED);
            }

            enrollment.courses.push(course);
            await this.enrolledCourseRepository.save(enrollment);
        } else {
            await this.enrolledCourseRepository.createEnrolledCourse(objectIdUserId, course)
        }
    }

    async getEnrolledCourses(userId: string): Promise<IEnrolledCourses> {

        const objectIdUserId = convertToObjectId(userId);

        const enrolledCourses = await this.enrolledCourseRepository.getEnrolledCoursesByUserId(objectIdUserId);

        if (!enrolledCourses) {
            throw createHttpError(HttpStatus.NO_CONTENT, HttpResponse.ENROLLED_COURSES_NOT_FOUND);
        }

        return enrolledCourses;
    }

    async updateTopicProgress(
        userId: string, 
        courseId: string, 
        topicId: string, 
        watchedDuration: number, 
        totalDuration: number
    ): Promise<void> {

        const enrolledCourse = await this.enrolledCourseRepository.findOne({ userId, "courses.courseId": courseId });

        if (!enrolledCourse) {
            throw createHttpError(HttpStatus.NOT_FOUND, HttpResponse.ENROLLED_COURSES_NOT_FOUND);
        }

        const course = enrolledCourse.courses.find(c => c.courseId.toString() === courseId);
        if (!course) return;

        let topicProgress = course.progress.find(p => p.topicId.toString() === topicId);

        if (!topicProgress) {
            throw createHttpError(HttpStatus.NOT_FOUND, HttpResponse.TOPIC_PROGRESS_NOT_FOUND);
        }

        console.log(totalDuration,'kj');
        

        topicProgress.watchedDuration = Math.min(watchedDuration, totalDuration);

        const completionPercentage = (topicProgress.watchedDuration / totalDuration) * 100;

        topicProgress.isCompleted = completionPercentage >= 80;

        if (topicProgress.isCompleted) {
            await this.updateCompletionStatus(userId, courseId);
        }

        await this.enrolledCourseRepository.save(enrolledCourse);
    }

    async updateCompletionStatus(userId: string, courseId: string): Promise<void> {

        const enrolledCourse = await this.enrolledCourseRepository.findOne({ userId, "courses.courseId": courseId });

        if (!enrolledCourse) {
            throw createHttpError(HttpStatus.NOT_FOUND, HttpResponse.ENROLLED_COURSES_NOT_FOUND);
        }

        const course = enrolledCourse.courses.find(c => c.courseId.toString() === courseId);
        if (!course) return;

        const completedTopics = course.progress.filter(p => p.isCompleted).length;
        const totalTopics = course.progress.length || 1;

        course.completionStatus = Math.round((completedTopics / totalTopics) * 100);

        await this.enrolledCourseRepository.save(enrolledCourse);
    }
}