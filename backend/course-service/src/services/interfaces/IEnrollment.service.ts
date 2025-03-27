import { IEnrolledCourses } from "@/models/enrolled-course.model";

export interface IEnrolledCourseService {
    enrollCourse(courseId: string, userId: string, paymentAmount: number, paymentId: string): Promise<void>;
    getEnrolledCourses(userId: string): Promise<IEnrolledCourses>;
}
