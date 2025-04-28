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
import { publishMessage } from "@/utils/rabbitmq.util";
import { CourseService } from "./course.service";

@injectable()
export class EnrolledCourseService implements IEnrolledCourseService {
    constructor(
        @inject("IEnrolledCourseRepository") private _enrolledCourseRepository: IEnrolledCourseRepository,
        @inject(TopicService) private _topicService: TopicService,
        @inject(CourseService) private _courseService: CourseService
    ) { }   

    async enrollCourse(courseId: string, userId: string, paymentAmount: number, paymentId: string, couponCode?: string): Promise<void> {

        const objectIdUserId = convertToObjectId(userId);
        const objectIdCourseId = convertToObjectId(courseId);

        let enrollment = await this._enrolledCourseRepository.getEnrolledCoursesByUserId(objectIdUserId);

        const topics = await this._topicService.getTopics(courseId);

        if (!topics) {
            throw createHttpError(HttpStatus.NOT_FOUND, HttpResponse.TOPICS_NOT_FOUND);
        }

        if(couponCode){
            await this._courseService.addUserToCouponUser(couponCode, userId);
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
            await this._enrolledCourseRepository.save(enrollment);
        } else {
            await this._enrolledCourseRepository.createEnrolledCourse(objectIdUserId, course)
        }
    }

    async getEnrolledCourses(userId: string): Promise<IEnrolledCourses> {

        const objectIdUserId = convertToObjectId(userId);

        const enrolledCourses = await this._enrolledCourseRepository.getEnrolledCoursesByUserId(objectIdUserId);

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

        const enrolledCourse = await this._enrolledCourseRepository.findOne({ userId, "courses.courseId": courseId });

        if (!enrolledCourse) {
            throw createHttpError(HttpStatus.NOT_FOUND, HttpResponse.ENROLLED_COURSES_NOT_FOUND);
        }

        const course = enrolledCourse.courses.find(c => c.courseId.toString() === courseId);
        if (!course) return;

        let topicProgress = course.progress.find(p => p.topicId.toString() === topicId);

        if (!topicProgress) {
            throw createHttpError(HttpStatus.NOT_FOUND, HttpResponse.TOPIC_PROGRESS_NOT_FOUND);
        }

        topicProgress.watchedDuration = Math.min(watchedDuration, totalDuration);

        const completionPercentage = (topicProgress.watchedDuration / totalDuration) * 100;

        topicProgress.isCompleted = completionPercentage >= 80;

        if (topicProgress.isCompleted) {
            await this.updateCompletionStatus(userId, courseId);
        }

        await this._enrolledCourseRepository.save(enrolledCourse);
    }

    async updateCompletionStatus(userId: string, courseId: string): Promise<void> {

        const enrolledCourse = await this._enrolledCourseRepository.findOne({ userId, "courses.courseId": courseId });

        if (!enrolledCourse) {
            throw createHttpError(HttpStatus.NOT_FOUND, HttpResponse.ENROLLED_COURSES_NOT_FOUND);
        }

        const course = enrolledCourse.courses.find(c => c.courseId.toString() === courseId);
        if (!course) return;

        const completedTopics = course.progress.filter(p => p.isCompleted).length;
        const totalTopics = course.progress.length || 1;

        course.completionStatus = Math.round((completedTopics / totalTopics) * 100);

        await this._enrolledCourseRepository.save(enrolledCourse);
    }

    async cancelEnrollment(userId: string, courseId: string): Promise<void> {

        const enrollment = await this._enrolledCourseRepository.findOne({ userId });

        const courseData = enrollment?.courses.find(course => course.courseId.toString() === courseId);

        if (!courseData) {
            throw createHttpError(HttpStatus.NOT_FOUND, HttpResponse.ENROLLED_COURSES_NOT_FOUND);
        }

        if (courseData.completionStatus === 100) {
            throw createHttpError(HttpStatus.BAD_REQUEST, HttpResponse.COURSE_FINISHED);
        }

        const totalTopics = courseData.progress.length;
        const completedTopics = courseData.progress.filter(p => p.isCompleted).length;
        const watchedPercentage = totalTopics > 0 ? (completedTopics / totalTopics) * 100 : 0;

        let refundAmount = 0;

        if (watchedPercentage < 10) {
            refundAmount = courseData.paymentAmount;
        } else if (watchedPercentage < 50) {
            refundAmount = Math.round(courseData.paymentAmount * 0.5);
        } else if (watchedPercentage < 80) {
            refundAmount = Math.round(courseData.paymentAmount * 0.8);
        } else {
            throw createHttpError(HttpStatus.BAD_REQUEST, HttpResponse.REFUND_UNAVAILABLE);
        }

        const walletData = {
            user_id: convertToObjectId(userId),
            type: "credit",
            source: "course",
            source_id: convertToObjectId(courseId),
            amount: refundAmount,
            description: `Refund for course cancellation`
        }

        publishMessage("course.refund.payment",{ walletData });

        const objectUserId = convertToObjectId(userId);
        await this._enrolledCourseRepository.updateOne(
            { userId: objectUserId },
            { $pull: { courses: { courseId: convertToObjectId(courseId) } } }
        );

    }
}