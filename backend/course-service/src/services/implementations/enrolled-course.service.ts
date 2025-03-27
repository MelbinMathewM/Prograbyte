import { inject } from "inversify";
import { injectable } from "inversify";
import { IEnrolledCourseRepository } from "@/repositories/interfaces/IEnrolled-course.repository";
import { convertToObjectId } from "@/utils/convert-objectid.util";
import { createHttpError } from "@/utils/http-error.util";
import { HttpStatus } from "@/constants/status.constant";
import { HttpResponse } from "@/constants/response.constant";
import { IEnrolledCourses } from "@/models/enrolled-course.model";
import { IEnrolledCourseService } from "../interfaces/IEnrollment.service";

@injectable()
export class EnrolledCourseService implements IEnrolledCourseService {
    constructor(@inject("IEnrolledCourseRepository") private enrolledCourseRepository: IEnrolledCourseRepository) { }

    async enrollCourse(courseId: string, userId: string, paymentAmount: number, paymentId: string): Promise<void> {

        const objectIdUserId = convertToObjectId(userId);
        const objectIdCourseId = convertToObjectId(courseId);

        let enrollment = await this.enrolledCourseRepository.getEnrolledCoursesByUserId(objectIdUserId);

        if (enrollment) {
            const isAlreadyEnrolled = enrollment.courses.some(c => c.courseId.equals(objectIdCourseId));
            if (isAlreadyEnrolled) {
                throw createHttpError(HttpStatus.CONFLICT, HttpResponse.COURSE_EXIST_ENROLLED);
            }

            enrollment.courses.push({ courseId: objectIdCourseId, paymentAmount, enrolledAt: new Date(), paymentId });
            await this.enrolledCourseRepository.save(enrollment);
        } else {
            await this.enrolledCourseRepository.createEnrolledCourse(objectIdUserId, {
                courseId: objectIdCourseId,
                paymentAmount,
                enrolledAt: new Date(),
                paymentId
            })
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
}