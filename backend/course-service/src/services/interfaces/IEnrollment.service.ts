import { IEnrolledCourses } from "@/models/enrolled-course.model";

export interface IEnrolledCourseService {
    enrollCourse(courseId: string, userId: string, paymentAmount: number, paymentId: string, couponCode?: string): Promise<void>;
    getEnrolledCourses(userId: string): Promise<IEnrolledCourses>;
    updateTopicProgress(userId: string, courseId: string, topicId: string, watchedDuration: number, totalDuration: number): Promise<void>;
    updateCompletionStatus(userId: string, courseId: string): Promise<void>;
    cancelEnrollment(userId: string, courseId: string): Promise<void>;
}
