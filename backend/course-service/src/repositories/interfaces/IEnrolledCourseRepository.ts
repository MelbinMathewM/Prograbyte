import { IEnrolledCourses, IEnrolledCourse } from "../../models/enrolledCoursesModel";
import { IBaseRepository } from "../IBaseRepository";
import { Types } from "mongoose";

export interface IEnrolledCourseRepository extends IBaseRepository<IEnrolledCourses> {
    getEnrolledCoursesByUserId(userId: Types.ObjectId): Promise<IEnrolledCourses | null>;
    createEnrolledCourse(userId: Types.ObjectId, course: IEnrolledCourse): Promise<void>;
}
