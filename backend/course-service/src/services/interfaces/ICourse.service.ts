import { ICourse } from "@/models/course.model";
import { IRating } from "@/models/rating.model";

export interface ICourseService {
    createCourse(course: ICourse): Promise<ICourse>;
    updateCourse(courseId: string, courseData: Partial<ICourse>): Promise<ICourse | null>;
    deleteCourse(courseId: string): Promise<void>;
    getCourses(filters: object, sort: string): Promise<ICourse[]>;
    getCourseDetail(id: string): Promise<ICourse | null>;
    changeCourseStatus(courseId: string, status: string): Promise<void>;
    addRating(userId: string, courseId: string, rating: number, review: string): Promise<void>;
    getRatings(courseId: string): Promise<IRating | null>;
}
