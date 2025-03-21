import { IEnrolledCourses } from "@/models/enrolledCoursesModel";

export interface IEnrolledCourseService {
    enrollCourse(courseId: string, userId: string, paymentAmount: number, paymentId: string): Promise<void>;
    getEnrolledCourses(userId: string): Promise<IEnrolledCourses>;
}
