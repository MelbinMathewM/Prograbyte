import { ICourse } from "@/models/course.model";

export interface ICourseService {
    createCourse(course: ICourse): Promise<ICourse>;
    updateCourse(courseId: string, courseData: Partial<ICourse>): Promise<ICourse | null>;
    deleteCourse(courseId: string): Promise<void>;
    getCoursesByTutorId(tutor_id: string): Promise<ICourse[] | null>;
    getCourses(): Promise<ICourse[] | null>;
    getCoursesByCategoryId(categoryId: string): Promise<ICourse[] | null>;
    getCourseDetail(id: string): Promise<ICourse | null>;
    changeCourseStatus(courseId: string, status: string): Promise<void>;
}
