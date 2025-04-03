import { ICourse } from "../../models/course.model";
import { IBaseRepository } from "../IBase.repository";

export interface ICourseRepository extends IBaseRepository<ICourse> {
    getFilteredCourses(filters: object, sort: string): Promise<ICourse[]>;
    changeCourseStatus(courseId: string, status: string): Promise<void>;
    getCourseDetail(id: string): Promise<ICourse | null>;
}
